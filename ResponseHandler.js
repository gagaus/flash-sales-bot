const DB = require('./DB');
const Utils = require('./Utils');
const Product = require('./product/Product');
const MessengerHelper = require('./MessengerHelper');
const UserConfig = require('./UserConfig');
const config = require('./backend_config');
const request = require('request');
const uuidv4 = require('uuid/v4');

const Postbacks = Utils.Postbacks;

exports.messageHandler = function(messagingEvent) {
  const psid = messagingEvent.sender.id;
  const messageText = messagingEvent.message ?
    messagingEvent.message.text : null;
  const messagePostback = messagingEvent.postback ?
    messagingEvent.postback.payload : null;
  const accountLinkStatus = messagingEvent.account_linking ?
    messagingEvent.account_linking.status : null;

  // conditions independent of user state
  if (messageText == "Logout" || messageText == "logout") {
    requestLogout(psid);
    return;
  }
  if (messagePostback == Postbacks.AKIT_LOGOUT.payload ||
    accountLinkStatus == "unlinked") {
      logoutUserOnDB(psid);
      return;
  }
  if (accountLinkStatus == "linked") {
    return;
  }
  console.log(DB.getLastStateForUser(psid));
  switch (DB.getLastStateForUser(psid)) {
    case UserConfig.State.INIT:
      Product.consumeProductInfo(psid);
      break;
    case UserConfig.State.PRODUCT_INFO_SENT:
      if (messagePostback == Postbacks.BUY_NOW.payload) {
        requestQuantity(psid, false);
      } else if (messagePostback == Postbacks.NOTIFY_AVAILABLE.payload) {
        MessengerHelper.sendMessageText(
          psid,
          'No worries, we will notify you the moment it becomes available.',
        );
      } else {
        defaultErrorMessage(psid);
      }
      break;
    case UserConfig.State.REQUEST_QUANTITY:
      if (messageText) {
        DB.setProductQuantityForUser(psid, messageText);
        processPurchase(psid);
      } else {
        defaultErrorMessage(psid);
      }
      break;
    case UserConfig.State.REQUEST_LOGIN_OPTIONS:
      if (messagePostback == Postbacks.AKIT_LOGIN.payload) {
        requestAkitLogin(psid);
      } else if (messagePostback == Postbacks.ACT_LINK_LOGIN.payload) {
        requestAccountLinkingLogin(psid);
      } else {
        defaultErrorMessage(psid);
      }
      break;
    case UserConfig.State.REQUEST_PAYMENT:
    default:
      MessengerHelper.sendMessageText('We\'re sorry, we couldn\'t understand ' +
        'your message, but we\'ve got something for you.');
      Product.consumeProductInfo(psid);
      DB.setLastStateForUser(psid, UserConfig.State.PRODUCT_INFO_SENT);
      break;
  }
}

exports.loginSuccess = function(psid, message) {
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createImageTemplate(config.LOGIN_SUCCESS_IMAGE_URL),
    MessengerHelper.sendMessageText.bind(
      this,
      psid,
      message,
      processPurchase.bind(this, psid),
    ),
  );
}

// title, subtitle, buttons, image
function requestLoginOptions(psid) {
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createGenericTemplate(
      'Login options',
      'You can login with Account Kit or your credentials in our website',
      [
        Utils.createPostbackButton(Postbacks.AKIT_LOGIN),
        Utils.createPostbackButton(Postbacks.ACT_LINK_LOGIN),
      ],
      config.LOGIN_OPTIONS_IMAGE_URL,
    ),
  );
  DB.setLastStateForUser(psid, UserConfig.State.REQUEST_LOGIN_OPTIONS);
}

function requestAccountLinkingLogin(psid) {
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createGenericTemplate(
      'Login in our website',
      'Please, login to continue',
      [
        Utils.createAccountLinkButton(),
      ],
      config.LOGIN_IMAGE_URL,
    ),
  );
}

function requestLogout(psid) {
  if (DB.isUserLoggedIn(psid)) {
    DB.getLoginMethodForUser(psid) == UserConfig.LoginMethod.ACCOUNT_KIT ?
      requestAkitLogout(psid) :
      requestAccountUnLink(psid);
  } else {
    MessengerHelper.sendMessageText(
      psid,
      'Good news, you are not logged in :)',
    );
  }
}

function requestAkitLogout(psid) {
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createGenericTemplate(
      'Logout',
      'Logout from Account Kit',
      [
        Utils.createPostbackButton(Postbacks.AKIT_LOGOUT),
      ],
      config.IMAGE_DOOR_URL,
    ),
  );
}

function requestAccountUnLink(psid) {
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createButtonTemplate(
      'Logout from our website',
      [
        Utils.createAccountUnLinkButton(),
      ]
    ),
  );
}

function logoutUserOnDB(psid) {
  DB.userLoggedOut(psid);
  DB.setAuthorizationCodeForUser(psid, null);
  DB.setLoginMethodForUser(psid, null);
  MessengerHelper.sendMessageText(
    psid,
    'You have logged out successfully.',
  );
}

function requestAkitLogin(psid) {
  var csrfCode = uuidv4();
  DB.setAuthorizationCodeForUser(psid, csrfCode);
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createAccountKitButtons(csrfCode),
  );
}

function requestPayment(psid) {
  const orderId = DB.getOrderIdForUser(psid);
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createButtonTemplate('Please open the website for payment',
      [
        Utils.createPaymentUrlButton(orderId),
      ]
    )
  );
  DB.setLastStateForUser(psid, UserConfig.State.REQUEST_PAYMENT);
}

function requestQuantity(psid, isError) {
  var error = '';
  if(isError) {
    error = 'Whoa! Caught you with an invalid entry! ';
  }
  MessengerHelper.sendMessageObj(
    psid,
    Utils.createQuickReplyObj(
      error + 'How many would you like? ',
      [
        Utils.createQuickReply(Utils.QuickReplies.QuantityOne),
        Utils.createQuickReply(Utils.QuickReplies.QuantityTwo),
        Utils.createQuickReply(Utils.QuickReplies.QuantityThree),
      ]
    ),
  );
  DB.setLastStateForUser(psid, UserConfig.State.REQUEST_QUANTITY);
}

function processPurchase(psid) {
  if (!DB.isUserLoggedIn(psid)) {
    requestLoginOptions(psid);
    return;
  }
  state = DB.getLastStateForUser(psid);
  product_id = DB.getProductForUser(psid);
  quantity = DB.getProductQuantityForUser(psid);
  console.log(state);
  // TODO: substitue psid with email/telephone
  const orderId = genOrderId(psid, product_id, quantity);
  DB.setOrderIdForUser(psid, orderId);
  requestPayment(psid);
}

function defaultErrorMessage(psid) {
  MessengerHelper.sendMessageText(psid, 'We\'re sorry, we didn\'t get ' +
    'your option, can you try again?');
}

function genOrderId(id, product, quantity) {
  // TODO ecomm: call api to get orderId
  return '123456789';
}

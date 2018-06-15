const DB = require('./DB');
const MessengerHelper = require('./MessengerHelper');
const UserConfig = require('./UserConfig');
const config = require('./backend_config');
const request = require('request');

exports.containsShopURL = function(messagingEvent) {
  return messagingEvent.message &&
    messagingEvent.message.attachments &&
    messagingEvent.message.attachments.length &&
    messagingEvent.message.attachments[0].url &&
    messagingEvent.message.attachments[0].url.includes('https://www.facebook.com/commerce/products/')
}

exports.containsImage = function(messagingEvent) {
  return messagingEvent.message &&
    messagingEvent.message.attachments &&
    messagingEvent.message.attachments.length &&
    messagingEvent.message.attachments[0].type === 'image';
}

exports.createQuickReplyObj = function(text, replies) {
  return {
    "text": text,
    "quick_replies": replies
  };
}

exports.createQuickReply = function(quickReplyButton) {
  return {
    "content_type": "text",
    "title": quickReplyButton.title,
    "payload": quickReplyButton.payload,
  };
}

exports.createButtonTemplate = function(text, buttons) {
  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons": buttons,
      }
    }
  };
}

exports.createImageTemplate = function(url) {
  return {
    "attachment":{
      "type":"image",
      "payload":{
        "url": url,
        "is_reusable": true,
      }
    }
  };
}

exports.createGenericTemplate = function(title, subtitle, buttons, image) {
  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title": title,
            "subtitle": subtitle,
            "image_url": image,
            "buttons": buttons,
          }
        ]
      }
    }
  };
}


exports.createGenericButton = function(name, url, messengerExtensions) {
  return {
    "type":"web_url",
    "url": url,
    "title": name,
    "webview_height_ratio": "tall",
    "messenger_extensions": messengerExtensions,
  };
}

exports.createPostbackButton = function(postbackButton) {
  return {
    "type": "postback",
    "title": postbackButton.title,
    "payload": postbackButton.payload,
  };
}

exports.createPaymentUrlButton = function(orderId) {
  return {
    "type":"web_url",
    "url": config.PAYMENT_URL + '?orderId=' + orderId,
    "title":"Pay now",
    "webview_height_ratio": "tall",
    "messenger_extensions": true,
  };
}

exports.createAccountLinkButton = function() {
  return {
    "type":"account_link",
    "url": config.LOGIN_URL,
  };
}

exports.createAccountUnLinkButton = function() {
  return {
    "type":"account_unlink",
  };
}

function accountKitButtonTemplate(text, urlSufix) {
  return {
    "title": text,
    "type":"web_url",
    "url": config.ACCOUNT_KIT_BASE_URL + urlSufix,
    "webview_height_ratio": "tall",
  };
}

exports.createAccountKitButtons = function(csrfCode) {
  // TODO remove &debug=true before going to prod
  var emailSufix = '/email_login?locale=pt_BR&debug=true&app_id=' +
    config.APP_ID + '&state=' + csrfCode + '&redirect=' + config.LOGIN_AKIT_URL;

  var smsSufix = '/sms_login?country_code=55&locale=pt_BR&debug=true&app_id=' +
    config.APP_ID + '&state=' + csrfCode + '&redirect=' +
    config.LOGIN_AKIT_URL;

  return this.createGenericTemplate(
    'Login with Account Kit',
    'Please, authenticate to continue',
    [
      accountKitButtonTemplate('with email', emailSufix),
      accountKitButtonTemplate('with SMS', smsSufix),
    ],
    config.LOGIN_IMAGE_URL,
  );
}

exports.whitelistPages = function(){
  let whitelistObj = {
      whitelisted_domains: [
          config.PAYMENT_URL,
          config.LOGIN_URL,
      ],
    };
  const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.9/me/messenger_profile',
    qs: { access_token: config.PAGE_ACCESS_TOKEN },
    json: whitelistObj
  }

  request(options, function(err, res, body) {
    console.log("Whitelist Sent");
    console.log(body);
  });
};

exports.Postbacks = {
  BUY_NOW: {"title": "Buy Now", "payload": "start_buy"},
  NOTIFY_AVAILABLE: {"title": "Notify me when available", "payload": "notify"},
  FB_REGISTER: {"title": "Log in with Facebook", "payload": "fb_login"},
  LATER_REGISTER: {"title": "Log in later", "payload": "later_login"},
  AKIT_LOGIN: {"title": "Account Kit", "payload": "akit_login"},
  AKIT_LOGOUT: {"title": "Logout from Account Kit", "payload": "akit_logout"},
  ACT_LINK_LOGIN: {"title": "Website", "payload": "act_link_login"},
}

exports.QuickReplies = {
  QuantityOne: {"title": "1", "payload": "quantity_1"},
  QuantityTwo: {"title": "2", "payload": "quantity_2"},
  QuantityThree: {"title": "3", "payload": "quantity_3"},
}

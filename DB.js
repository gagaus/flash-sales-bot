const UserConfig = require('./UserConfig');

let userStateDB = {};

exports.addNewUser = function(psid) {
  userStateDB[psid] = new UserConfig();
}

exports.addUserIfNonExisting = function(psid) {
  if (!userStateDB[psid]) {
    userStateDB[psid] = new UserConfig();
  }
}

exports.getUserConfig = function(psid) {
  console.log(userStateDB[psid]);
  return userStateDB[psid];
}

exports.setLastStateForUser = function(psid, state) {
  if (userStateDB[psid]) {
    userStateDB[psid].setState(state);
  }
}

exports.getLastStateForUser = function(psid) {
  if (userStateDB[psid]) {
    return userStateDB[psid].getState();
  }
  return null;
}

exports.setProductIdForUser = function(psid, id) {
  if (userStateDB[psid]) {
    userStateDB[psid].setProductId(id);
  }
}

exports.getProductIdForUser = function(psid) {
  if (userStateDB[psid]) {
    return userStateDB[psid].getProductId();
  }
  return null;
}

exports.setProductForUser = function(psid, product) {
  if (userStateDB[psid]) {
    userStateDB[psid].setProduct(product);
  }
}

exports.getProductForUser = function(psid) {
  if (userStateDB[psid]) {
    return userStateDB[psid].getProduct();
  }
  return null;
}

exports.setProductQuantityForUser = function(psid, num) {
  if (userStateDB[psid]) {
    userStateDB[psid].setQuantity(num);
  }
}

exports.getProductQuantityForUser = function(psid) {
    if (userStateDB[psid]) {
    return userStateDB[psid].getQuantity();
  }
  return null;
}

exports.setAddressForUser = function(psid, address) {
  if (userStateDB[psid]) {
    userStateDB[psid].setAddress(address);
  }
}

exports.getAddressForUser = function(psid) {
    if (userStateDB[psid]) {
    return userStateDB[psid].getAddress();
  }
  return null;
}

exports.setOrderIdForUser = function(psid, order_id) {
  if (userStateDB[psid]) {
    userStateDB[psid].setOrderId(order_id);
  }
}

exports.getOrderIdForUser = function(psid) {
    if (userStateDB[psid]) {
    return userStateDB[psid].getOrderId();
  }
  return null;
}

exports.setPaymentMethodForUser = function(psid, paymentMethod) {
  if (userStateDB[psid]) {
    userStateDB[psid].setPaymentMethod(paymentMethod);
  }
}

exports.getPaymentMethodForUser = function(psid) {
    if (userStateDB[psid]) {
    return userStateDB[psid].getPaymentMethod();
  }
  return null;
}

exports.setAuthorizationCodeForUser = function(psid, authorizationCode) {
  console.log('setting crsf code: ' + psid + ', ' + authorizationCode);
  if (userStateDB[psid]) {
    userStateDB[psid].setAuthorizationCode(authorizationCode);
  }
}

exports.getAuthorizationCodeForUser = function(psid) {
  return userStateDB[psid] ? userStateDB[psid].getAuthorizationCode() : null;
}

exports.userLoggedIn = function(psid) {
  if (userStateDB[psid]) {
    userStateDB[psid].logIn();
  }
}

exports.userLoggedOut = function(psid) {
  if (userStateDB[psid]) {
    userStateDB[psid].logOut();
  }
}

exports.isUserLoggedIn = function(psid) {
  return userStateDB[psid] ? userStateDB[psid].isLoggedIn() : false;
}

exports.setLoginMethodForUser = function(psid, loginMethod) {
  if (userStateDB[psid]) {
    userStateDB[psid].setLoginMethod(loginMethod);
  }
}

exports.getLoginMethodForUser = function(psid) {
  return userStateDB[psid] ? userStateDB[psid].getLoginMethod() : null;
}

exports.logginUserForAuthorizationCode = function(authorizationCode) {
  for (psid in userStateDB) {
    if (userStateDB[psid].getAuthorizationCode() === authorizationCode) {
      userStateDB[psid].logIn();
      userStateDB[psid].setLoginMethod(UserConfig.LoginMethod.ACCOUNT_KIT);
      return psid;
    }
  }
  return null;
}

exports.logginUserForAccountLinking = function(psid) {
  userStateDB[psid].logIn();
  userStateDB[psid].setLoginMethod(UserConfig.LoginMethod.ACCOUNT_LINKING);
}

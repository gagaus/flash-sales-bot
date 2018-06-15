const State = {
  INIT: 'init',
  PRODUCT_INFO_SENT: 'product_info_sent',
  REQUEST_QUANTITY: 'request_quantity',
  REQUEST_LOGIN_OPTIONS: 'request_login_options',
  LOGGED: 'logged',
  REQUEST_PAYMENT: 'request_payment',
  FINISHED_BUY: 'finished_buy',

  REQUEST_ADDRESS: 'request_address',
  REQUEST_PRODUCT_ACTION: 'request_product_action',
}

const LoginMethod = {
  ACCOUNT_KIT: 'account_kit',
  ACCOUNT_LINKING: 'account_linking',
}

class UserConfig {
  constructor() {
    this.product_id = null;
    this.quantity = null;
    this.state = State.INIT;
    // authorization code from account linking or
    // csrf code from account kit
    this.authorizationCode = null;
    this.loggedIn = false;
    this.loginMethod = null;
  }

  static get State() {
    return State;
  }

  static get LoginMethod() {
    return LoginMethod;
  }

  setProductId(id) {
    this.product_id = id;
  }

  getProductId() {
    return this.product_id;
  }

  setProduct(product) {
    this.product = product;
  }

  getProduct() {
    return this.product;
  }

  setQuantity(num) {
    this.quantity = num;
  }

  getQuantity() {
    return this.quantity;
  }

  setPaymentMethod(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  setAddress(address) {
    this.address = address;
  }

  getAddress() {
    return this.address;
  }

  setOrderId(order_id) {
    this.order_id = order_id;
  }

  getOrderId() {
    return this.order_id;
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  setAuthorizationCode(authorizationCode) {
    this.authorizationCode = authorizationCode;
  }

  getAuthorizationCode() {
    return this.authorizationCode;
  }

  logIn() {
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  setLoginMethod(loginMethod) {
    this.loginMethod = loginMethod;
  }

  getLoginMethod() {
    return this.loginMethod;
  }
}

module.exports = UserConfig;

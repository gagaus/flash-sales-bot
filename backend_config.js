// user access token with business_management permission for fetching
// product information from product catalog
const USER_ACCESS_TOKEN = '';
const PAGE_ACCESS_TOKEN = '';
const ACCOUNT_KIT_APP_SECRET = '';
const APP_ID = '';
const APP_SECRET = '';
const VERFICATION_TOKEN = 'psa_bot'
// TODO get real productId from ad_id
const PRODUCT_ID = ;
const BASE_GRAPH_API_URL = 'https://graph.facebook.com/v2.12/';
const ME_ENDPOINT_BASE_URL = 'https://graph.facebook.com/v2.9/me';
// your messenger webhook domain
const DOMAIN = 'https://old-dog-16.localtunnel.me';
const PAYMENT_POSTBACK_URL = DOMAIN + '/payment_postback';
const PAYMENT_URL = DOMAIN + '/payment';
// website login page url, in this case, is the same domain as the webhook
const LOGIN_URL = DOMAIN + '/login';
const LOGIN_AKIT_URL = DOMAIN + '/akit_success';
const CONFIRMATION_URL = DOMAIN + '/confirmation';
const LOGIN_OPTIONS_IMAGE_URL = DOMAIN + '/images/login_options.jpg';
const LOGIN_IMAGE_URL = DOMAIN + '/images/login.jpg';
const LOGIN_SUCCESS_IMAGE_URL = DOMAIN + '/images/login_success.jpg';
const ACCOUNT_KIT_BASE_URL = 'https://www.accountkit.com/v1.3/basic/dialog';
const ACCOUNT_KIT_ME_BASE_URL = 'https://graph.accountkit.com/v1.3/me';
const ACCOUNT_KIT_TOKEN_EXCHANGE_URL = 'https://graph.accountkit.com/v1.3/access_token';

module.exports = {
  USER_ACCESS_TOKEN,
  PAGE_ACCESS_TOKEN,
  VERFICATION_TOKEN,
  BASE_GRAPH_API_URL,
  PAYMENT_URL,
  LOGIN_URL,
  APP_ID,
  PAYMENT_POSTBACK_URL,
  PRODUCT_ID,
  CONFIRMATION_URL,
  ME_ENDPOINT_BASE_URL,
  ACCOUNT_KIT_APP_SECRET,
  ACCOUNT_KIT_BASE_URL,
  ACCOUNT_KIT_ME_BASE_URL,
  ACCOUNT_KIT_TOKEN_EXCHANGE_URL,
  LOGIN_AKIT_URL,
  LOGIN_OPTIONS_IMAGE_URL,
  LOGIN_IMAGE_URL,
  LOGIN_SUCCESS_IMAGE_URL,
};
// Photo by Naomi Suzuki on Unsplash

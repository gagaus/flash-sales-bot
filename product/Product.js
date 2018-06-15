const DB = require('../DB');
const Utils = require('../Utils');
const CatalogAPI = require('./CatalogAPI');
const MessengerHelper = require('../MessengerHelper');
const UserConfig = require('../UserConfig');
const config = require('../backend_config');

exports.consumeProductInfo = function(psid) {
  // split productId from url
  const productId = config.PRODUCT_ID;

  // save to DB
  DB.setProductIdForUser(psid, productId);
  CatalogAPI.fetchProduct(productId, psid, onFetchProductCallback);
}

function onFetchProductCallback(product, psid) {
  console.log(product);
  DB.setProductForUser(psid, product);

  let productInfo = `Availability: ${product.availability}\nCurrency: ${product.currency}\nPrice: ${product.price}`;

  if (product.sale_price) {
    productInfo += '\nSale Price:' + product.sale_price;
  }

  if (product.additional_variant_attributes) {
    product.additional_variant_attributes.forEach(function(variantAttribute) {
      productInfo += '\n' + variantAttribute.key + ': ' + variantAttribute.value;
    });
  }

  MessengerHelper.sendMessageObj(
    psid,
    Utils.createGenericTemplate(
      product.name,
      productInfo,
      [
        Utils.createPostbackButton(Utils.Postbacks.BUY_NOW),
        Utils.createPostbackButton(Utils.Postbacks.NOTIFY_AVAILABLE),
      ],
      product.image_url,
    )
  );
  DB.setLastStateForUser(psid, UserConfig.State.PRODUCT_INFO_SENT);
}

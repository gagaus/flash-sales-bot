const Utils = require('./Utils');
const MessengerHelper = require('./MessengerHelper');
const config = require('./config');

exports.sendProductInfo = function(psid) {
  const product = config.ProductData;
  console.log(psid);
  let productInfo = 'Preço: R$ ' + product.price;
  if (product.sale_discount) {
    productInfo += '\nDesconto: ' + product.sale_discount;
  }

  MessengerHelper.sendMessageObj(
    psid,
    Utils.createGenericTemplate(
      product.name,
      productInfo,
      [
        Utils.createWebUrlButton(product.url, product.button_text),
      ],
      product.image_url,
    )
  );
}

exports.sendDescription = function(psid) {
  const product = config.ProductData;
  MessengerHelper.sendMessageText(
    psid,
    product.description,
  );
}

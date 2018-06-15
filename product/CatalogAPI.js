const config = require('../backend_config');
const request = require('request');

// Takes in productId and callback function which looks like this: function(err, res, body) {}
exports.fetchProduct = function(productId, psid, callback) {
  console.log('fetching product');

  const options = {
    method: 'GET',
    uri: `${config.BASE_GRAPH_API_URL} ${productId}`,
    qs: { access_token: config.USER_ACCESS_TOKEN, fields: 'name,availability,description,additional_variant_attributes,currency,price,sale_price,image_url,product_group{variants}' },
  }
  request(options, function(err, res, body) {
    let product = JSON.parse(res.body);
    if (product.price) {
      product.price = parseFloat(product.price.replace('$', '').replace(',', ''));
    }

    if (product.sale_price) {
      product.sale_price = parseFloat(product.sale_price.replace('$', ''));
    }
    callback(product, psid);
  });
}

const config = require('./config');
const request = require('request');

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

exports.createWebUrlButton = function(url, title) {
  return {
    "type":"web_url",
    "url": url,
    "title":title,
    "messenger_extensions": true,
  };
}

exports.initBotConfig = function(){
  const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.9/me/messenger_profile',
    qs: { access_token: config.PAGE_ACCESS_TOKEN },
    json: {
        whitelisted_domains: getWhitelistPageList(),
        persistent_menu: getPersistentMenu(this.Postbacks.KNOW_MORE),
        get_started: {payload: this.Postbacks.GEN_COUPON.payload},
    },
  }

  request(options, function(err, res, body) {
    console.log("Whitelist Sent");
    console.log(body);
  });
};

function getWhitelistPageList () {
  return [
      config.ProductData.url,
  ];
}

function getPersistentMenu (postback) {
  return [{
   locale : "default",
   composer_input_disabled : true,
   call_to_actions : [postback],
  }];
}

exports.Postbacks = {
  GEN_COUPON: {"title": "Get coupon", "payload": "open_thread"},
  KNOW_MORE: {"title": "Saber mais", "type":"postback", "payload": "know_more"},
}

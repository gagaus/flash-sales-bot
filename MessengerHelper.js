const config = require('./backend_config');
const request = require('request');

exports.sendMessageText = function(psid, message, callback = function() {}) {
  let messageObj = {
    recipient: {
      id: psid,
    },
    message: {
      text: message
    }
  };

  const options = {
    method: 'POST',
    uri: config.ME_ENDPOINT_BASE_URL + '/messages',
    qs: { access_token: config.PAGE_ACCESS_TOKEN },
    json: messageObj
  }

  request(options, function(err, res, body) {
    console.log("Message Sent");
    console.log(body);
    callback();
  });
}

exports.sendMessageObj = function(psid, message, callback = function() {}) {
  let messageObj = {
      recipient: {
        id: psid,
      },
      message: message
    };
  const options = {
    method: 'POST',
    uri: config.ME_ENDPOINT_BASE_URL + '/messages',
    qs: { access_token: config.PAGE_ACCESS_TOKEN },
    json: messageObj
  }

  request(options, function(err, res, body) {
    console.log("Message Sent");
    console.log(body);
    callback();
  });
};

const config = require('./config');
const request = require('request');

exports.sendMessageText = function(psid, message) {
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
    uri: 'https://graph.facebook.com/v2.9/me/messages',
    qs: { access_token: config.PAGE_ACCESS_TOKEN },
    json: messageObj
  }

  request(options, function(err, res, body) {
    console.log("Message Sent");
    console.log(body);
  });
}

exports.sendMessageObj = function(psid, message) {
  let messageObj = {
      recipient: {
        id: psid,
      },
      message: message
    };
  const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.9/me/messages',
    qs: { access_token: config.PAGE_ACCESS_TOKEN },
    json: messageObj
  }
  console.log('sendMessageObj')
  console.log(messageObj);
  request(options, function(err, res, body) {
    console.log("Message Sent");
    console.log(err);
    console.log(body);
  });
};

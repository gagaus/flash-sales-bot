// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const Utils = require('./Utils');
const ResponseHandler = require('./ResponseHandler');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//webhok verification
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'psa_bot') {
        console.log('FB Webhook verification request received');
        res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed FB Webhook verification');
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  console.log('incoming');
  var data = req.body;
  console.log(data);
  // Make sure this is a page subscription
  if (data && data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message || messagingEvent.postback) {
          ResponseHandler.messageHandler(messagingEvent);
        }
        else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
  else {
    console.log("undefined data");
    res.sendStatus(200);
  }
});

// listen for requests :)
var listener = app.listen(65172, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  Utils.initBotConfig();
});

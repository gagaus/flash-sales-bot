// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const MessengerHelper = require('./MessengerHelper');
const Mustache  = require('mustache');
const DB = require('./DB');
const Utils = require('./Utils');
const ResponseHandler = require('./ResponseHandler');
const bodyParser = require('body-parser');
const config = require('./backend_config.js');
const fs = require('fs');
const path = require("path");
const request = require('request');
const uuidv4 = require('uuid/v4');
const queryString = require('querystring');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/payment', (req, res, next) => {
    let referer = req.get('Referer');
    if (referer) {
        if (referer.indexOf('www.messenger.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
        } else if (referer.indexOf('www.facebook.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
        }
        res.sendFile(path.join(__dirname+'/public/payment_test/credit_card.html'));
    }
});

app.get('/confirmation', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/payment_test/confirmation.html'));
});

app.get('/js/config.js', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/js/config.js'));
});

// serve account linking login page
app.get('/login', function(req, response) {
  var authorizationCode = uuidv4();
  var accountLinkingToken = req.query['account_linking_token'];
  var view = {
    redirect_uri: req.query['redirect_uri'],
    account_linking_token: accountLinkingToken,
    authorization_code: authorizationCode,
  };
  var endpoint = config.ME_ENDPOINT_BASE_URL + '?access_token=' +
    config.PAGE_ACCESS_TOKEN + '&fields=recipient&account_linking_token=' +
    accountLinkingToken;

  request.get({url: endpoint, json:true }, function(err, resp, respBody) {
    // send login_success.html
    var psid = respBody.recipient;
    if (psid) {
      view.psid = psid;
      console.log(view);
      DB.setAuthorizationCodeForUser(psid, authorizationCode);
      var html = Mustache.to_html(
        fs.readFileSync(__dirname+'/login/external_login.html').toString(),
        view,
      );
      response.send(html);
    } else {
      console.error("Invalid account linking token");
      response.sendStatus(403);
    }
  });
});

// verify login with account linking
app.get('/login_linking', function(req, response) {
  // TODO verify users and password match, req.query['username'] req.query['password']
  var psid = req.query['psid'];
  var authorizationCodeDB = DB.getAuthorizationCodeForUser(psid);
  var authorizationCode = req.query['authorization_code'];
  var redirectUri = decodeURIComponent(req.query['redirect_uri']);
  // TODO remove "!req.query['password'] &&", it for debugging
  if (!req.query['password'] && authorizationCodeDB === authorizationCode) {
    redirectUri += "&authorization_code=" + authorizationCode;
    DB.logginUserForAccountLinking(psid);
    ResponseHandler.loginSuccess(psid, 'Thanks for logging in. To logout at ' +
      'anytime, just type \'logout\'.');
    response.status(200).redirect(redirectUri);
  } else {
    console.error("Invalid Authorization Code");
    // redirect url without authorization_code fails automatically
    response.sendStatus(200).redirect(redirectUri);
  }
});

// handle login success with account kit
app.get('/akit_success', function(req, response) {
  var psid = DB.logginUserForAuthorizationCode(req.query['state']);
  if (req.query['status'] === "PARTIALLY_AUTHENTICATED" && psid !== null) {
    var app_access_token =
      ['AA', config.APP_ID, config.ACCOUNT_KIT_APP_SECRET].join('|');
    var params = {
      grant_type: 'authorization_code',
      code: req.query['code'],
      access_token: app_access_token,
    };

    // exchange tokens
    var token_exchange_url = config.ACCOUNT_KIT_TOKEN_EXCHANGE_URL + '?' +
      queryString.stringify(params);
    request.get(
      {url: token_exchange_url, json: true},
      function(err, resp, respBody) {
        var view = {
          user_access_token: respBody.access_token,
          expires_at: respBody.expires_at,
          user_id: respBody.id,
        };

        // get account details at /me endpoint
        var me_endpoint_url = config.ACCOUNT_KIT_ME_BASE_URL +
          '?access_token=' + respBody.access_token;
        request.get(
          {url: me_endpoint_url, json:true },
          function(err, resp, respBody) {
            var message = 'Thanks for authenticating your ';
            if (respBody.phone) {
              view.phone_num = respBody.phone.number;
              message += 'phone number ' + respBody.phone.number;
            } else if (respBody.email) {
              view.email_addr = respBody.email.address;
              message += 'email address ' + respBody.email.address;
            }
            message += '. To logout at anytime, just type \'logout\'.'
            ResponseHandler.loginSuccess(psid, message);
            var html = Mustache.to_html(
              fs.readFileSync(__dirname+'/login/success_akit.html').toString(),
              view,
            );
            response.send(html);
          },
        );
      },
    );

  } else {
    // login failed
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("Something went wrong. :( ");
  }
});

app.get('/test', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/public/payment_test/credit_card.html'));
});

app.get('/payment_postback', (req, res) => {
    console.log('payment_postback');
    let body = req.query;
    console.log(body);
    const response = (body.status == "success") ?
      'Awesome, payment confirmed!' :
      'Failed :(';
    res.status(200).send('Please close this window to return to the conversation thread.');
    MessengerHelper.sendMessageText(body.psid, response);
});

app.use(express.static('public'));
app.use('/static', express.static('public'));

app.get("/", function (req, response) {
  response.sendFile(__dirname + '/views/confirmation.html');
});

//webhok verification
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.VERFICATION_TOKEN) {
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

  // Make sure this is a page subscription
  if (data && data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      // Iterate over each messaging event
      pageEntry.messaging ?
        pageEntry.messaging.forEach(function(messagingEvent) {
          if (messagingEvent.message || messagingEvent.postback ||
            messagingEvent.account_linking) {
            console.log('received message');
            if (messagingEvent.message) {
              console.log('message\n', messagingEvent.message);
            }
            if (messagingEvent.postback) {
              console.log('postback\n', messagingEvent.postback);
            }
            if (messagingEvent.account_linking) {
              console.log('account_linking\n', messagingEvent.account_linking);
            }
            const psid = messagingEvent.sender.id;
            DB.addUserIfNonExisting(psid);
            ResponseHandler.messageHandler(messagingEvent);
          }
          else {
            console.log("Unknown messagingEvent: ", messagingEvent);
          }
        }) : console.log(pageEntry);
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
  Utils.whitelistPages();
});

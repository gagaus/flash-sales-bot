Flash Sales Bot
=================

This bot was created with the objective of prototyping bots for Flash Sales.

To reproduce, configure your app on [Facebook Developers](http://developers.facebook.com/apps) with the following permissions:
  * messages,
  * messaging_postbacks
  * messaging_referrals

After associating your page with the webhook, run

`npm install`

to initit the setup. To run the bot server, run

`node server.js`

Fill the config.js file with your page access token and the product data.

Create an ad on Facebook with the messaging objective and configure one quick reply with the `gen_coupon` payload.

And you are done :D

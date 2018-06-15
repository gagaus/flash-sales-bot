# Flash Sales Bot

This bot was created with the objective of prototyping bots for Flash Sales.

Demo Video with Account Kit login:

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/DfI0GzfXmqA/0.jpg)](https://youtu.be/DfI0GzfXmqA)

Demo Video with Account Linking login:

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/l-hRnBsPLW8/0.jpg)](https://youtu.be/l-hRnBsPLW8)



## Requirements

  * Admin access to a [Facebook Page](https://www.facebook.com/bookmarks/pages)
  * A [Facebook App](http://developers.facebook.com/apps)
  * [Node.js](https://nodejs.org/en/)

## Setup

To build your own bot from scratch (or with a little help), try the [Messenger Platform Quick Start Tutorial](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start).

Otherwise, to run this bot, configure your app on [Facebook Developers](http://developers.facebook.com/apps) with the following permissions:
  * messages
  * messaging_postbacks
  * messaging_referrals
  * messaging_account_linking

After associating your page with the webhook, run

`npm install`

to install required Node packages.
Start the server running

`node server.js`

Fill the `backend_config.js` file with your [Page Access Token](https://developers.facebook.com/docs/pages/access-tokens).

For initial tests or development, you can install and use [Local Tunnel](https://localtunnel.github.io/www/).
With your node server up, run

`lt --port 65172`

Use the domain provided by Local Tunnel to replace `DOMAIN` in `backend_config.js` and in `product/payment_test/frontend_config.js`, and restart your node server. [Setup your webhook](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup) with:

`<lt_domain> + /webhook`

`VERIFICATION_TOKEN` is also in `backend_config.js` with default value 'psa_bot'.

Ex.:

![alt text](https://github.com/Gagaus/flash_sales_bot/blob/master/readme_files/webhook_setup.png "Webhook Setup")

To enable [Account Kit](https://developers.facebook.com/docs/accountkit/) login, whitelist the domain and redirect url ending with `akit_success` in your app dashboard (`https://developers.facebook.com/apps/<APP_ID>/account-kit/settings/`).

Ex.:

![alt text](https://github.com/Gagaus/flash_sales_bot/blob/master/readme_files/akit_setup.png "Account Kit Setup")

## Optional

#### Get Started Button

Setup [Get Started Button](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button) with

```
curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "open_thread"}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>
```

#### Account (Un)Linking
In case you need it, you can [unlink accounts from Account Linking](https://developers.facebook.com/docs/messenger-platform/identity/account-linking#unlink) with

```
curl -X POST -H "Content-Type: application/json" -d '{
   "psid":"<PSID>"
}' "https://graph.facebook.com/v2.6/me/unlink_accounts?access_token=<PAGE_ACCESS_TOKEN>
```

## Cheatsheet

Easiest way to get a Page Access Token is:

1. Go to [Graph Explorer](https://developers.facebook.com/tools/explorer/)
2. Get an User Access Token with `manage_pages`
3. Select the Page you want on the drop down.
4. Copy the token from the Access Token field.

To see token permissions, expiration date, etc, use [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken).

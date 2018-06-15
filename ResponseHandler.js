const Utils = require('./Utils');
const Product = require('./product');
const config = require('./config');
const MessengerHelper = require('./MessengerHelper');

exports.messageHandler = function(messagingEvent) {
  const psid = messagingEvent.sender.id;
  console.log(messagingEvent);
  if (messagingEvent.message !== undefined &&
      messagingEvent.message.quick_reply !== undefined  &&
      messagingEvent.message.quick_reply.payload === Utils.Postbacks.GEN_COUPON.payload) {
      Product.sendProductInfo(messagingEvent.sender.id);
      return;
    }
  if (messagingEvent.postback !== undefined &&
      messagingEvent.postback.payload === Utils.Postbacks.GEN_COUPON.payload) {
      Product.sendProductInfo(messagingEvent.sender.id);
      return;
  }
  if (messagingEvent.postback !== undefined &&
      messagingEvent.postback.payload === Utils.Postbacks.KNOW_MORE.payload) {
      Product.sendDescription(messagingEvent.sender.id);
      return;
  }
}

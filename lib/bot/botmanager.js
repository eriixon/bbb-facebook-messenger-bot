'use strict';
let fbo = require('./confirmations');
let fpb = require('./postback');
let fms = require('./message');

class BotManager {
    manageEvent(event, session, callback) {
        if (event.read)     fbo.receivedMessageRead(event);
        if (event.delivery) fbo.receivedDeliveryConfirmation(event);
        if (event.postback) fpb.handlePayload (event, session);
        if (event.message)  fms.handleMessage (event, session);
        callback(session);
    }
}

module.exports = new BotManager();
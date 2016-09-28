'use strict';
let atm = require('./messages/attachments'),
    mst = require('./messages/messagetext'),
    qkr = require('./messages/quickreply');

// This class can manage all messages coming from user (text, attachments and quick replies)
class Messages {
    handleMessage(event, session) {
        let senderID = event.sender.id;
        let message = '';
        // when user sends the location from mobile devices
        let attachments = event.message.attachments;
        // when user selects one quick reply button = > select city
        let quickReply = event.message.quick_reply;
        // user writes something to the bot
        let messageText = event.message.text;
        console.log("Received message for user %d and page %d at %d", senderID, event.recipient.id, event.timestamp);
        
        if (messageText) message = messageText;
        if (quickReply) message = quickReply;
        if (attachments) message = attachments;

        switch(message) {
            case attachments:
                atm.handlerAttachments(session, attachments);
                break;
            case quickReply:
                qkr.handlerReply (session, quickReply);
                break;
            case messageText:
                mst.handlerMessageText(session, messageText);
                break;
        }}
}

module.exports = new Messages();
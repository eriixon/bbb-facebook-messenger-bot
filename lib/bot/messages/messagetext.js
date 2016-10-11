'use strict';
let fba = require('../../api/fbapi');
let bbb = require('../../api/bbbapi');
let bph = require('../../constants/botphrases');
let urs = require('../../utilities/usersay');
let dym = require('../../utilities/didyoumean');
let note = require('../../utilities/notifications');
let validator = require('../../utilities/validator');

// The class manage all incoming messages from users
class MessageText {

    handlerMessageText(session, messageText) {
        let condition = false;
        messageText = messageText.trim();
        // if (!condition && !session.context.chat&& !session.context.state && !session.context.zip) condition = "TRY_AGAIN";
        if (typeof (session.context.chat) === "boolean") condition = 'CHAT';
        if (typeof (session.context.state) === "boolean") condition = 'STATE';
        if (typeof (session.context.city) === "boolean") condition = 'CITY';
        if (typeof (session.context.name) === "boolean") condition = 'NAME';
        // if (uph[messageText.toUpperCase()]) condition = 'WORD'; // Looking for specific words
        // if (typeof (session.context.zip) === "boolean") condition = 'ZIP';
        if(!condition) condition = urs.checkForWords(session,messageText,condition);

        switch (condition) {
            case false:
                fba.sendTextMessage(session, bph['UNKNOWN_INPUT']);
                break;
            case 'WORD':
                break;
            case 'CHAT':
                fba.askUserData(session).then(name => {
                    let noteNode = {message:messageText,firstName:name.first_name,lastName:name.last_name,pid:session.pid};
                    note.agentChat(noteNode);
                })
                break;
            // case 'ZIP':
            //     if (validator.validateZip(messageText)) {
            //         session.context.zip = validator.validateZip(messageText);
            //         session.context.name = true;
            //         let location = `Location: ${session.context.zip}`;
            //         console.log (location);
            //         fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.BUSINESS_NAME);});
            //     } else fba.sendTextMessage(session.fbid, bph.BAD_INPUT);
            //     break;
            case 'STATE':
                if (validator.validateState(messageText,session)) {
                    let location = `Location: ${session.context.stateFull}, ${session.context.country}`;
                    console.log (location);
                    fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.FIND_CITY);});
                } else fba.sendTextMessage(session, bph.BAD_INPUT);
                break;
            case 'CITY':
                if (session.context.foundCity) {
                    session.context.city = messageText;
                    session.context.name = true;
                    let location = `Location: ${session.context.city}, ${session.context.state}, ${session.context.country}`;
                    console.log (location);
                    fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.BUSINESS_NAME);});
                } else validator.validateCity(messageText, session);
                break;
            case 'NAME':
                session.context.name = messageText;
                fba.sendTextMessage(session, bph.LOADING).then(function(){
                    // Send data to BBB API and show response
                    bbb.createList(session, newList => {
                        if (!newList) dym.didYouMean(session);
                        else fba.sendBusinessList(session,newList).then(()=>fba.sendTextMessage(session, bph.THANK_MESSAGE));
                    });                    
                });
            break;
    }}
}

module.exports = new MessageText();
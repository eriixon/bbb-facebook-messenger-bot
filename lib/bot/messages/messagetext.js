'use strict';
let fba = require('../../api/fbapi');
let bbb = require('../../api/bbbapi');
let bph = require('../../constants/botphrases');
let uph = require('../../constants/userphrases');
let dym = require('../../utilities/didyoumean');
let note = require('../../utilities/notifications');
let validator = require('../../utilities/validator');

// The class manage all incoming messages from users
class MessageText {

    handlerMessageText(session, messageText) {

        let condition = false;
        let point = session.context;
        messageText = messageText.trim();

        if (!point.chat&&!point.userLoc && !point.state && !point.zip) condition = "TRY_AGAIN";
        if (typeof (point.chat) === "boolean") condition = 'CHAT';
        if (typeof (point.zip) === "boolean") condition = 'ZIP';
        if (typeof (point.state) === "boolean") condition = 'STATE';
        if (typeof (point.city) === "boolean") condition = 'CITY';
        if (typeof (point.name) === "boolean") condition = 'NAME';
        // Looking for specific words
        if (uph[messageText.toUpperCase()]) condition = 'WORD';

        switch (condition) {
            case "TRY_AGAIN":
                fba.sendTextMessage(session.fbid, uph['UNKNOWN']);
                break;
            case 'WORD':
                if (uph[messageText.toUpperCase()] == uph['STOP']) point.endSession = true;
                fba.sendTextMessage(session.fbid, uph[messageText.toUpperCase()]);
                break;
            case 'CHAT':
                fba.askUserData(session.fbid).then(name => {
                    note.agentChat({message:messageText,firstName:name.first_name,lastName:name.last_name});
                })
                break;
            case 'ZIP':
                if (validator.validateZip(messageText)) {
                    point.zip = validator.validateZip(messageText);
                    point.name = true;
                    let location = `Location: ${point.zip}`;
                    console.log (location);
                    fba.sendTextMessage(session.fbid, location).then(function(){fba.sendTextMessage(session.fbid, bph.BUSINESS_NAME);});
                } else fba.sendTextMessage(session.fbid, bph.BAD_INPUT);
                break;
            case 'STATE':
                if (validator.validateState(messageText)) {
                    point.state = validator.validateState(messageText).state;
                    point.country = validator.validateState(messageText).country;
                    point.city = true;
                    let location = `Location: ${point.state}, ${point.country}`;
                    console.log (location);
                    fba.sendTextMessage(session.fbid, location).then(function(){fba.sendTextMessage(session.fbid, bph.FIND_CITY);});
                } else fba.sendTextMessage(session.fbid, bph.BAD_INPUT);
                break;
            case 'CITY':
                if (point.foundCity) {
                    point.city = messageText;
                    point.name = true;
                    let location = `Location: ${point.city}, ${point.state}, ${point.country}`;
                    console.log (location);
                    fba.sendTextMessage(session.fbid, location).then(function(){fba.sendTextMessage(session.fbid, bph.BUSINESS_NAME);});
                } else validator.validateCity(messageText, session);
                break;
            case 'NAME':
                point.name = messageText;
                fba.sendTextMessage(session.fbid, bph.LOADING).then(function(){
                    // Send data to BBB API and show response
                    bbb.createList(session, newList => {
                        if (!newList) dym.didYouMean(session);
                        else fba.sendBusinessList (session,newList);
                    });                    
                });
            break;
    }}
}

module.exports = new MessageText();
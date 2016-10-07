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
        let point = session.context;
        messageText = messageText.trim();

        // if (!condition && !point.chat&& !point.state && !point.zip) condition = "TRY_AGAIN";
        if (typeof (point.chat) === "boolean") condition = 'CHAT';
        if (typeof (point.state) === "boolean") condition = 'STATE';
        if (typeof (point.city) === "boolean") condition = 'CITY';
        if (typeof (point.name) === "boolean") condition = 'NAME';
        // if (uph[messageText.toUpperCase()]) condition = 'WORD'; // Looking for specific words
        // if (typeof (point.zip) === "boolean") condition = 'ZIP';
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
            //         point.zip = validator.validateZip(messageText);
            //         point.name = true;
            //         let location = `Location: ${point.zip}`;
            //         console.log (location);
            //         fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.BUSINESS_NAME);});
            //     } else fba.sendTextMessage(session.fbid, bph.BAD_INPUT);
            //     break;
            case 'STATE':
                if (validator.validateState(messageText)) {
                    point.state = validator.validateState(messageText).state;
                    point.country = validator.validateState(messageText).country;
                    point.city = true;
                    let location = `Location: ${point.state}, ${point.country}`;
                    console.log (location);
                    fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.FIND_CITY);});
                } else fba.sendTextMessage(session, bph.BAD_INPUT);
                break;
            case 'CITY':
                if (point.foundCity) {
                    point.city = messageText;
                    point.name = true;
                    let location = `Location: ${point.city}, ${point.state}, ${point.country}`;
                    console.log (location);
                    fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.BUSINESS_NAME);});
                } else validator.validateCity(messageText, session);
                break;
            case 'NAME':
                point.name = messageText;
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
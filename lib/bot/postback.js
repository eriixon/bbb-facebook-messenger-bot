'use strict';
const request = require('request');
const config = require('config');
const PAGE_TOKEN = config.get('MESSENGER_PAGE_ACCESS_TOKEN');
let fba = require('../api/fbapi');
let bph = require('../constants/botphrases');
let welcomeImage = require('../constants/ratingimgs').welcome;

// Handler for postback coming after button click
class Postbacks {
  // Postback from FB after pushing some button
  handlePayload(event, session) {
    let senderID = event.sender.id;
    let payload = event.postback.payload;
    let self = this;
    console.log("Received postback for user %d and page %d with payload '%s' at %d", senderID, event.recipient.id, payload, event.timestamp);

    switch (payload) {
      // BUTTON Get start
      case 'GET_START':
        self.startConversation(senderID, session, (greetings) => {fba.sendMessage(greetings)});
        break;
      case 'FIND_BUSINESS':
        session.context = {};
        self.findBusinessMenu(senderID);
        break;
      case 'CHAT_AGENT':
        session.context = {};
        session.context.chat = true;
        fba.sendTextMessage(senderID,bph.AGENT_CHAT);
        break;
      case 'SEARCH_BY_STATE':
        session.context = {};
        session.context.state = true;
        fba.sendTextMessage(senderID,bph.SEARCH_BY_STATE);
        break;
      case 'SEARCH_BY_ZIP':
        session.context = {};
        session.context.zip = true;
        fba.sendTextMessage(senderID,bph.SEARCH_BY_ZIP);
        break;
      case 'USER_LOCATION':
        session.context = {};
        session.context.userLoc = true;
        fba.sendTextMessage(senderID,bph.UL_WARNING).then(function(){ fba.sendTextMessage(senderID,bph.UL_SEND);});
        break;
    }
  }
// Start topic for conversation
  startConversation(recipientID, session, callback) {
    fba.askUserData(recipientID).then(function(name){
      callback({
        recipient:{id: recipientID},
        message:{
          attachment: {
            type: "template",
            payload:{
              template_type:"generic",
              elements:[{
                title:`Hello ${name.first_name} ${name.last_name}!`,
                subtitle:bph.WELCOME_MESSAGE,
                image_url:welcomeImage,
                buttons:[
                  {type:"postback",title:"Find Business",payload: "FIND_BUSINESS"},
                  {type:"postback",title:"Chat with Agent",payload:"CHAT_AGENT"}
                ]
              }]
        }}}});
    });
  }
// BUSINESS FINDER MENU
  findBusinessMenu(recipientID){
    fba.sendMessage({
      recipient:{id:recipientID},
      message:{
        attachment: {
        type: "template",
        payload:{
          template_type: "button",
          text: bph.FIND_MESSAGE,
          buttons:[
            {type:"postback",title:"By City and State",payload:"SEARCH_BY_STATE"},
            {type:"postback",title:"Send Location", payload:"USER_LOCATION" }
        // { type: "postback", title: "By ZIP Code", payload: "SEARCH_BY_ZIP" },
      ]}}}
    });
  }
};
module.exports = new Postbacks();
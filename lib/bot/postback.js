'use strict';
let fba = require('../api/fbapi');
let bph = require('../constants/botphrases');
let welcomeImage = require('../constants/ratingimgs').welcome;

// Handler for postback coming after button click
class Postbacks {
  // Postback from FB after pushing some button
  handlePayload(event, session) {
    // let senderID = event.sender.id;
    let payload = event.postback.payload;
    console.log("Received postback for user %d and page %d with payload '%s' at %d", session.fbid, session.pid, payload, event.timestamp);

    switch (payload) {
      // BUTTON Get start
      case 'GET_START':
        this.startConversation(session,(greetings)=>{fba.sendMessage(session.pid,greetings)});
        break;
      case 'FIND_BUSINESS':
        session.context = {};
        fba.sendMessage(session.pid, this.findBusinessMenu(session.fbid));
        break;
      case 'CHAT_AGENT':
        session.context = {};
        session.context.chat = true;
        fba.sendTextMessage(session,bph.AGENT_CHAT);
        break;
      // case 'SEARCH_BY_STATE':
      //   session.context = {};
      //   session.context.state = true;
      //   fba.sendTextMessage(senderID,bph.SEARCH_BY_STATE);
      //   break;
      // case 'SEARCH_BY_ZIP':
      //   session.context = {};
      //   session.context.zip = true;
      //   fba.sendTextMessage(senderID,bph.SEARCH_BY_ZIP);
      //   break;
      // case 'USER_LOCATION':
      //   session.context = {};
      //   session.context.userLoc = true;
      //  // fba.sendTextMessage(senderID,bph.UL_WARNING).then(function(){ fba.sendTextMessage(senderID,bph.UL_SEND);});
      //   break;
    }
  }
// Start topic for conversation
  startConversation(session, callback) {
    fba.askUserData(session).then(function(name){
      callback({
        recipient:{id: session.fbid},
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
  findBusinessMenu(recipientId) {
    return {
        recipient:{id: recipientId},
        message:{
          text:bph.FIND_MESSAGE,
          quick_replies:[
            {content_type:"text",title:"By State and City",payload:"SEARCH_BY_STATE"},
            {content_type:"location",title:"Send Location",payload:"USER_LOCATION"}
          ]
      }};
  };

};
module.exports = new Postbacks();


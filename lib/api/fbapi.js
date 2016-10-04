'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
let request = require('request');
let scm = require('../utilities/cardmaker');
let pages = require('../../config/pages');

// Facebook API request for sending messages to the bot
class CallFBApi {
 // Send message to Facebook API
  sendMessage(pageID, messageData) {
    let body = JSON.stringify(messageData);
    let PAGE_TOKEN = pages[pageID].page_token;
    let URL = `https://graph.facebook.com/me/messages?access_token=${PAGE_TOKEN}`;
    let data = {method: 'POST', headers: {'Content-Type': 'application/json'}, body};
    return fetch(URL, data).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      return json;
    });
  }
//   function callSendAPI(messageData) {
//   request({
//     uri: 'https://graph.facebook.com/v2.7/me/messages',
//     qs: { access_token: PAGE_ACCESS_TOKEN },
//     method: 'POST',
//     json: messageData

//   }, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var recipientId = body.recipient_id;
//       var messageId = body.message_id;

//         if (messageId) {
//           console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
//         } else {
//           console.log("Successfully called Send API for recipient %s", recipientId);
//         }
//     } else {
//         console.error(response.error);
//     }
//   });  
// }
  // Send simple text messsage
  sendTextMessage(sides, messageText) {
    return this.sendMessage(sides.pid, {recipient:{id:sides.uid},message:{text:messageText,metadata:"TEXT"}});
  }
  // ask name of user
  askUserData(sides){
    let PAGE_TOKEN = pages[sides.pid].page_token;
    let URL = `https://graph.facebook.com/v2.7/${sides.uid}?fields=first_name,last_name&access_token=${PAGE_TOKEN}`;
    return fetch(URL).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      return json;
    });
  }
  sendBusinessList (session, list){
    session.context.endSession = true;
    let cards = scm.cardPool(list);
    let messageData = {recipient:{id:session.fbid},message:{attachment:{type:"template",payload:{template_type: "generic",elements: cards}}}};
    return this.sendMessage(session.pid, messageData);
  }
  sendWelcomeConfig(id, message){
    let body = JSON.stringify(message);
    let URL = `https://graph.facebook.com/v2.7/me/thread_settings?access_token=${pages[id].page_token}`;
    let data = {method: 'POST', headers: {'Content-Type': 'application/json'}, body};
    fetch(URL, data).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      else console.log(json.result);
      return json;
    });
  }
  


}
module.exports = new CallFBApi();


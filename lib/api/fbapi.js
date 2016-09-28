'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
const config = require('config');
const PAGE_TOKEN = config.get('MESSENGER_PAGE_ACCESS_TOKEN');
let scm = require('../utilities/cardmaker');
let bph = require('../constants/botphrases');


// Facebook API request for sending messages to the bot
class CallFBApi {
 // Send message to Facebook API
  sendMessage(messageData) {
    let body = JSON.stringify(messageData);
    let fburl = 'https://graph.facebook.com/me/messages?access_token='+encodeURIComponent(PAGE_TOKEN);
    let data = {method: 'POST', headers: { 'Content-Type': 'application/json'}, body};
    return fetch(fburl, data).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      return json;
    });
  }
  // Send simple text messsage
  sendTextMessage(recipientId, messageText) {
    return this.sendMessage({recipient:{id:recipientId },message:{text:messageText,metadata:"TEXT"}});
  }
  // ask name of user
  askUserData (recipientID){
    let fburl = `https://graph.facebook.com/v2.7/${recipientID}?fields=first_name,last_name&access_token=${PAGE_TOKEN}`;
    return fetch(fburl).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      // console.log(json);
      return json;
    });
  }
  sendBusinessList (session, list){
    session.context.endSession = true;
    let cards = scm.cardPool(list);
    let messageData = {recipient:{id:session.fbid},message:{attachment:{type:"template",payload:{template_type: "generic",elements: cards}}}};
    return this.sendMessage(messageData).then(function(){fba.sendTextMessage(session.fbid, bph.THANK)});
  }
  noData (recipientId){
    return this.sendMessage({recipient:{id:recipientId},message:{text:bph.NOT_FOUND,metadata:"TEXT"}});
  }

}
module.exports = new CallFBApi();
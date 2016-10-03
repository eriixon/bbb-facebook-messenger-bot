'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
const config = require('config');
// const PAGE_TOKEN = config.get('MESSENGER_PAGE_ACCESS_TOKEN');
let scm = require('../utilities/cardmaker');
let pages = require('../../config/pages');

// Facebook API request for sending messages to the bot
class CallFBApi {
 // Send message to Facebook API
  sendMessage(pageID, messageData) {
    let body = JSON.stringify(messageData);
    let PAGE_TOKEN = pages[pageID];
    let fburl = 'https://graph.facebook.com/me/messages?access_token='+encodeURIComponent(PAGE_TOKEN);
    let data = {method: 'POST', headers: { 'Content-Type': 'application/json'}, body};
    return fetch(fburl, data).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      return json;
    });
  }
  // Send simple text messsage
  sendTextMessage(sides, messageText) {
    return this.sendMessage(sides.pid, {recipient:{id:sides.uid},message:{text:messageText,metadata:"TEXT"}});
  }
  // ask name of user
  askUserData(sides){
    let PAGE_TOKEN = pages[sides.pid];
    let fburl = `https://graph.facebook.com/v2.7/${sides.uid}?fields=first_name,last_name&access_token=${PAGE_TOKEN}`;
    return fetch(fburl).then(rsp => rsp.json()).then(json => {
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

}
module.exports = new CallFBApi();


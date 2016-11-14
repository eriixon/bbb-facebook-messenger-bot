'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
let scm = require('../utilities/cardmaker');
let fbdb = require('../utilities/firebase');

// Facebook API request for sending messages to the bot
class CallFBApi {
 // Send message to Facebook API
  sendMessage(pageID,token, messageData) {
    let body = JSON.stringify(messageData);
    let URL = `https://graph.facebook.com/me/messages?access_token=${token}`;
    let data = {method: 'POST', headers: {'Content-Type': 'application/json'}, body};
    return fetch(URL, data).then(rsp => rsp.json()).then(json => {
      if (json.error && json.error.message) throw new Error(json.error.message);
      console.log (json);
      return json;
    });
  };
  // Send simple text messsage
  sendTextMessage(session, messageText) {
    console.log(" SEND TEXT MESSAGE")
    return this.sendMessage(session.pid,session.token,{recipient:{id:session.fbid},message:{text:messageText,metadata:"TEXT"}});
  }
  // ask name of user
  askUserData(session){
    fbdb.getToken(session.pid, PAGE_TOKEN => {
      let URL = `https://graph.facebook.com/v2.7/${session.fbid}?fields=first_name,last_name&access_token=${PAGE_TOKEN}`;
      return fetch(URL).then(rsp => rsp.json()).then(json => {
        if (json.error && json.error.message) throw new Error(json.error.message);
        return json;
      });
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
    fbdb.getToken(id, PAGE_TOKEN => {
      let URL = `https://graph.facebook.com/v2.6/${id}/thread_settings?access_token=${PAGE_TOKEN}`;
      let data = {method: 'POST', headers: {'Content-Type': 'application/json'}, body};
      fetch(URL, data).then(rsp => rsp.json()).then(json => {
        if (json.error && json.error.message) throw new Error(json.error.message);
        else console.log(json.result);
        return json;
      });
    });
  };
};


module.exports = new CallFBApi();


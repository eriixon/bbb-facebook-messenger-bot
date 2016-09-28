'use strict';
const request = require('request');
const FB_URL= `https://graph.facebook.com/v2.7/me/thread_settings?access_token=${process.env.MESSENGER_PAGE_ACCESS_TOKEN}`;
let bph = require('../constants/botphrases');

// This class can set up the Welcome button, Welcome Screen and Persistent Menu.
class FBconfig {
    welcome() {
        this.welcomeScreen();
        this.welcomeButton();
        this.createMenu();
    }
// Welcome sentence in the first visit of bot
    welcomeScreen() {
        let qs = {setting_type:'greeting',greeting:{text: bph.GREETING}};
        this.sendRequest(qs);
    }
// Welcome button for the first visit
    welcomeButton() {
        let qs = {setting_type:'call_to_actions', thread_state: 'new_thread', call_to_actions: [{ payload: 'GET_START' }]};
        this.sendRequest(qs);
    }
// Persistent menu for search
    createMenu() {
        let call_to_actions = [{type:"postback",title:"Chat with Agent",payload:"CHAT_AGENT"},{type:"postback",title:"Find Business",payload: "FIND_BUSINESS"}]
        let qs = {setting_type:'call_to_actions', thread_state: 'existing_thread', call_to_actions:call_to_actions};
        this.sendRequest(qs);
    }
    sendRequest(qs){
        request({method:'POST', uri:FB_URL, json:true, qs:qs}, (error, response, body)=>{
            if (!error && response.statusCode == 200) console.log(body.result);
        });
    }
}

module.exports = new FBconfig();
'use strict';
const request = require('request');
const config = require('config');
// const PAGE_TOKEN = config.get('MESSENGER_PAGE_ACCESS_TOKEN');
const FB_URL= 'https://graph.facebook.com/v2.7/me/thread_settings?access_token=';
let bph = require('../constants/botphrases');

// This class can set up the Welcome button, Welcome Screen and Persistent Menu.
class FBconfig {
    welcome(pat) {
        this.welcomeScreen(pat);
        this.welcomeButton(pat);
        this.createMenu(pat);
    }
// Welcome sentence in the first visit of bot
    welcomeScreen(pat) {
        let qs = {setting_type:'greeting',greeting:{text: bph.GREETING}};
        this.sendRequest(qs,pat);
    }
// Welcome button for the first visit
    welcomeButton(pat) {
        let qs = {setting_type:'call_to_actions', thread_state: 'new_thread', call_to_actions: [{ payload: 'GET_START' }]};
        this.sendRequest(qs,pat);
    }
// Persistent menu for search
    createMenu(pat) {
        let call_to_actions = [{type:"postback",title:"Chat with Agent",payload:"CHAT_AGENT"},{type:"postback",title:"Find Business",payload: "FIND_BUSINESS"}]
        let qs = {setting_type:'call_to_actions', thread_state: 'existing_thread', call_to_actions:call_to_actions};
        this.sendRequest(qs,pat);
    }
    sendRequest(qs,pat){
        request({method:'POST', uri:FB_URL+pat, json:true, qs:qs}, (error, response, body)=>{
            if (!error && response.statusCode == 200) console.log(body.result);
        });
    }
}

module.exports = new FBconfig();
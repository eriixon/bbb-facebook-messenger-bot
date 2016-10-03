'use strict';
const request = require('request');
const config = require('config');
const FB_URL= 'https://graph.facebook.com/v2.7/me/thread_settings?access_token=';
let bph = require('../constants/botphrases');
let pages = require('./config/pages');

// This class can set up the Welcome button, Welcome Screen and Persistent Menu.
class FBconfig {
    welcome() {
        for (var id in pages){
            console.log("Set up config for page :" + id);
            let pat = pages[id]// page access tokens
            //Welcome sentence in the first visit of bot
            this.sendRequest(pat,{setting_type:'greeting',greeting:{text: bph.GREETING}});
            // Welcome button for the first visit
            this.sendRequest(qs,{setting_type:'call_to_actions',thread_state:'new_thread',call_to_actions:[{payload:'GET_START'}]});
            // Persistent menu for search
            let callToActions = [{type:"postback",title:"Chat with Agent",payload:"CHAT_AGENT"},{type:"postback",title:"Find Business",payload: "FIND_BUSINESS"}]
            this.sendRequest(pat,{setting_type:'call_to_actions',thread_state:'existing_thread', call_to_actions:callToActions});
        };
    }
    sendRequest(pat,qs){
        request({method:'POST', uri:FB_URL+pat, json:true, qs:qs}, (error, response, body)=>{
            if (!error && response.statusCode == 200) console.log(body.result);
        });
    }
}

module.exports = new FBconfig();
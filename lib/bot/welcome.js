'use strict';
let bph = require('../constants/botphrases');
let fba = require('../api/fbapi');
let pages = require('../../config/pages');

// This class can set up the Welcome button, Welcome Screen and Persistent Menu.
class FBconfig {
    welcome() {
        for (var id in pages){
            console.log("Set up config for page :" + id);
            //Welcome sentence in the first visit of bot
            let greeting = {setting_type:'greeting',greeting:{text: bph.GREETING}};
            fba.sendWelcomeConfig(id,greeting);
            // Welcome button for the first visit
            let getStarted = {setting_type:'call_to_actions',thread_state:'new_thread',call_to_actions:[{payload:'GET_START'}]};
            fba.sendWelcomeConfig(id,getStarted);
            // Persistent menu for search
            let callToActions = [
                {type:"postback",title:"Chat with Agent",payload:"CHAT_AGENT"},
                {type:"postback",title:"Find Business",payload: "FIND_BUSINESS"},
                {type:"web_url",url:"https://www.bbb.org/consumer-complaints/file-a-complaint/get-started",title:"File a complaint"},
                {type:"web_url",url:"https://www.bbb.org/scamtracker/us",title:"Report a Scam"}
                ];
            let persistentMenu = {setting_type:'call_to_actions',thread_state:'existing_thread', call_to_actions:callToActions};
            fba.sendWelcomeConfig(id,persistentMenu);
        };
    }
}

module.exports = new FBconfig();
"use strict";
let fba = require('../api/fbapi');
let phrases = require('../constants/userphrases');

class UserSay {
    checkForWords(session, message, condition){
      let mess = message.toUpperCase();
      phrases.WORDS.forEach(word => {      
        if (mess.indexOf(word)>-1){
          condition = "WORD";
          let button=[];
          switch (word) {
            case 'HELLO':
            case 'HI':
              fba.sendTextMessage(session, phrases.SENTENCES.HELLO);
              break;
            case 'FIND':
            case 'MENU':
            case 'SEARCH':
            case 'HELP':
              fba.sendTextMessage(session, phrases.SENTENCES.SEARCH);
              break;
            case 'STOP':
            case 'EXIT':
            case 'QUIT':
            case 'RESET':
              session.context = {};
              session.context.endSession=true;
              fba.sendTextMessage(session, phrases.SENTENCES.STOP);
              break;
            case 'COMPLAINT':
              button = [{type:"web_url",url:"https://www.bbb.org/consumer-complaints/file-a-complaint/get-started",title:"Start your complaint"}]
              this.messageMaker(session.pid,session.fbid,phrases.SENTENCES.COMPLAINT,button);
              break;  
            case 'SCAM':
              button = [{type:"web_url",url:"https://www.bbb.org/scamtracker/us",title:"Report a Scam"}]
              this.messageMaker(session.pid,session.fbid,phrases.SENTENCES.SCAM,button);
              break;
          }
        }
        return condition;
      });
      return condition;
    }
    messageMaker (pageID, userID, text, button){
      fba.sendMessage(pageID,{recipient:{id:userID},message:{attachment:{type:"template",payload:{template_type:"button",text:text,buttons:button}}}});
    };
  }
  module.exports = new UserSay();
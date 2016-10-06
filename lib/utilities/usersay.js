"use strict";
let fba = require('../api/fbapi');
let phrases = require('../constants/userphrases');


class UserSay {
    checkForWords(session, message, condition){
      let mess = message.toUpperCase();
      phrases.WORDS.forEach(word => {      
        if (mess.indexOf(word)>-1){
          condition = "WORD";
          switch (word) {
            case 'HELLO':
            case 'HI':
              fba.sendTextMessage(session, phrases.SENTENCES.HELLO)
              break;
            case 'STOP':
            case 'EXIT':
            case 'QUIT':
            case 'RESET':
              session.context = {};
              session.context.endSession=true;
              fba.sendTextMessage(session, phrases.SENTENCES.STOP);
              break;        
            default:
              break;
          }
        }
        return condition;
      });
      return condition;
    }
  }
  module.exports = new UserSay();
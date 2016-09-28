let bph = require('../../constants/botphrases');
let fba = require('../../api/fbapi');

class QuickReplies {
    handlerReply (session, quickreply) {
        if (quickreply.payload == "OTHER"){
            session.context.foundCity = true;
            fba.sendTextMessage(session.fbid, stn.SMALL_CITY);
        } else {
            session.context.name = true;
            session.context.city = quickreply.payload;
            let location = `Location: ${session.context.city}, ${session.context.state}, ${session.context.country}`;
            console.log (location);
            fba.sendTextMessage(session.fbid, location ).then(function() {fba.sendTextMessage(session.fbid, bph.BUSINESS_NAME);});
    }}
}

module.exports = new QuickReplies();
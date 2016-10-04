let bph = require('../../constants/botphrases');
let fba = require('../../api/fbapi');

class QuickReplies {
    handlerReply (session, quickreply) {
        let sides = {pid:session.pid,uid:session.fbid}; // page and user IDs
        switch (quickreply.payload){
            case 'SEARCH_BY_STATE':
                session.context = {};
                session.context.state = true;
                fba.sendTextMessage(sides,bph.SEARCH_BY_STATE);
                break;
            case "OTHER":
                session.context.foundCity = true;
                fba.sendTextMessage(sides, bph.SMALL_CITY);
                break;
            default:
                session.context.name = true;
                session.context.city = quickreply.payload;
                let location = `Location: ${session.context.city}, ${session.context.state}, ${session.context.country}`;
                console.log (location);
                fba.sendTextMessage(sides, location ).then(function() {fba.sendTextMessage(sides, bph.BUSINESS_NAME);});
                break;
        }
    }
}

module.exports = new QuickReplies();
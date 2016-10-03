let bph = require('../../constants/botphrases');
let fba = require('../../api/fbapi');
let gmm = require('../../api/gmapi');

class Attachments {
    handlerAttachments(session, attachments) {
        if (attachments[0].payload.coordinates) {
            var coordinates = attachments[0].payload.coordinates;
            gmm.findCityState(coordinates, cityState => {
                session.context = {};
                let sides = {pid:session.pid,uid:session.fbid};// page and user IDs
                if (cityState) {
                    session.context.city = cityState.city;
                    session.context.state = cityState.state;
                    session.context.country = cityState.country;
                    session.context.name = true;
                    let location = `Location: ${session.context.city}, ${session.context.state}, ${session.context.country}`;
                    console.log (location);
                    fba.sendTextMessage(sides, location).then(function(){fba.sendTextMessage(sides, bph.BUSINESS_NAME);});
                 } else fba.sendTextMessage(sides,bph.BAD_LOCATION);
            });
        } else fba.sendTextMessage(sides,bph.BAD_ATTACHMENT);
    }
}

module.exports = new Attachments();
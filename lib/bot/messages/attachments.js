let bph = require('../../constants/botphrases');
let fba = require('../../api/fbapi');
let gmm = require('../../api/gmapi');

class Attachments {
    handlerAttachments(session, attachments) {
        if (attachments[0].payload.coordinates) {
            var coordinates = attachments[0].payload.coordinates;
            gmm.findCityState(coordinates, cityState => {
                session.context = {};
                if (cityState) {
                    session.context.city = cityState.city;
                    session.context.state = cityState.state;
                    session.context.country = cityState.country;
                    session.context.name = true;
                    let location = `Location: ${session.context.city}, ${session.context.state}, ${session.context.country}`;
                    console.log (location);
                    fba.sendTextMessage(session, location).then(function(){fba.sendTextMessage(session, bph.BUSINESS_NAME);});
                 } else fba.sendTextMessage(session,bph.BAD_LOCATION);
            });
        } else fba.sendTextMessage(session,bph.BAD_ATTACHMENT);
    }
}

module.exports = new Attachments();
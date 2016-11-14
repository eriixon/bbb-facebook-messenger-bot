"use strick"
let fbdb = require('../utilities/firebase');

class Sessions{
    findOrCreateSession(userID,pageID,token,sessions) {
        let sessionId;
        // Let's see if we already have a session for the user fbid
        Object.keys(sessions).forEach(function (key) {
            if (sessions[key].fbid===userID && sessions[key].pid===pageID) sessionId = key;
        });
        // or create a new one
        if (!sessionId) {
            sessionId = new Date().toISOString();
            sessions[sessionId] = {"fbid":userID,"pid":pageID,"token":token,"context": {}};
        };
        return sessionId;
    }
}
module.exports = new Sessions;
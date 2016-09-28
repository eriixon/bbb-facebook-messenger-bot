
function findOrCreateSession(fbid, sessions) {
    var sessionId;
    // Let's see if we already have a session for the user fbid
    Object.keys(sessions).forEach(function (key) {
        if (sessions[key].fbid === fbid) sessionId = key;
    });
    // or create a new one
    if (!sessionId) {
        sessionId = new Date().toISOString();
        sessions[sessionId] = {"fbid": fbid, "context": {} };
    }
    return sessionId;
}

module.exports = { findOrCreateSession: findOrCreateSession };
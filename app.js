'use strict';
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const config = require('config');
const app = express();

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

let sessions = require('./lib/utilities/sessions');
let fbw = require('./lib/bot/welcome');
let bm = require('./lib/bot/botmanager');
let fbdb = require('./lib/utilities/firebase.js');

const APP_SECRET = config.get('MESSENGER_APP_SECRET');
const VALIDATION_TOKEN = config.get('MESSENGER_VALIDATION_TOKEN');
const PAGE_TOKEN = config.get('MESSENGER_PAGE_ACCESS_TOKEN');
const SERVER_URL = config.get('SERVER_URL');
const REGPASS = config.get('PASS');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_TOKEN && SERVER_URL)) {
  console.error("Missing config values"); 
  process.exit(1)
};

let currentSessions = {};  // Array of sessions: one session for one user
// fbw.bigWelcome();          // Configuration of the bot

// SETUP WEBHOOK
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Success validation");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation");
    res.sendStatus(403);
  };
});

// FACEBOOK WEBHOOK
app.post('/webhook', function (req, res) {
  let data = req.body;
  // Make sure this is a page subscription
  if (data.object == 'page') {
    data.entry.forEach(function (pageEntry) {
      let pageID = pageEntry.id;
      let senderID = pageEntry.messaging[0].sender.id;
      fbdb.getToken(pageID, token =>{
        let sessionID = sessions.findOrCreateSession(senderID,pageID,token,currentSessions);
        let session = currentSessions[sessionID];
        if (senderID != pageID) {
          pageEntry.messaging.forEach(messagingEvent => {
            bm.manageEvent(messagingEvent, session, (updatedSession) => {
              if (updatedSession.context.endSession) delete currentSessions[sessionID];
            });
        })};
      });
    });
    res.sendStatus(200);
  };
});

// VERIFICATION OF CALLBACKS
function verifyRequestSignature(req, res, buf) {
  let signature = req.headers["x-hub-signature"];
  if (!signature) {
    // For testing, let's log an error. In production, you should throw an error.
    console.error("Couldn't validate the signature.");
  } else {
    let elements = signature.split('=');
    let method = elements[0];
    let signatureHash = elements[1];
    let expectedHash = crypto.createHmac('sha1', APP_SECRET).update(buf).digest('hex');
    if (signatureHash != expectedHash) throw new Error("Couldn't validate the request signature.");
  }
};

app.put('/setPage', function(req,res){
  if(req.body.regpass === REGPASS) {
    let page = {pageId: req.body.pageId, token: req.body.token, email:req.body.email};
    fbdb.inputPage(page,id=>fbw.welcome(id));
    res.send("DONE");
  } else res.send("NOPASS");
});

// START SERVER
app.listen(app.get('port'), () => console.log('Facebook bot app is running on port', app.get('port')));



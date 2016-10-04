'use strict';
const nodemailer = require('nodemailer');
const config = require('config');
const BOT_EMAIL = config.get('BOT_EMAIL');
const FINDER_PASS = config.get("FINDER_PASS");
const DATA_EDITOR_EMAIL = config.get("DATA_EDITOR_EMAIL");
let pages = require('../../config/pages');

// The sender emails to admin if wrong data comes from BBB api
class Notifications {
    sendEmail(message) {
        let opts = {service:'Gmail', auth: {user: BOT_EMAIL, pass: FINDER_PASS}};
        let transporter = nodemailer.createTransport(opts);
        transporter.sendMail(message, (error, info) => {
            if(error) return console.log(error);
            console.log('Message sent: ' + info.response);
        });
    }
    badDataEmail(note){
        this.sendEmail({
            from: BOT_EMAIL,
            to: DATA_EDITOR_EMAIL,
            subject: 'Business Data Notification',
            html: '<h2>The notification of bad data in the bussiness account </h2>'+
            `<p>Business name: ${note.name}</p>
             <p>Location: '${note.city} ${note.state}</p>
             <p>Lost data: ${note.lostdata}</p>
             <p>BBB Link: ${note.link}</p>`
        });        
    }
    agentChat(note){
        this.sendEmail({
            from: BOT_EMAIL,
            to: pages[note.pid].email,
            subject: `Agent chat request from ${note.firstName} ${note.lastName}`,
            html: '<h2>The notification of an agent chat request</h2>'+
            `<p>User name: ${note.firstName} ${note.lastName}</p><p>Message: ${note.message} </p>`
        });
    }
    
}
module.exports = new Notifications();
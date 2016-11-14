let firebase = require('firebase');
firebase.initializeApp({databaseURL: "https://bbbbot-12a5d.firebaseio.com",serviceAccount: './config/fire.json'});

class Firebase {
    inputPage(page, cb){
        firebase.database().ref(page.pageId).set(page);
        cb(page.pageId);
    };
    getToken(pageID, cb){
        firebase.database().ref(pageID).once('value').then(snapshot => cb(snapshot.val().token));
    };
    getEmail(pageID){
        firebase.database().ref(pageID).once('value').then(snapshot => cb(snapshot.val().email));
    };
};

module.exports = new Firebase();
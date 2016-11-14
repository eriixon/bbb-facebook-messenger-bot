let firebase = require('firebase');
firebase.initializeApp({databaseURL: "https://bbbbot-12a5d.firebaseio.com",serviceAccount: '../../config/fire.json'});
let db = firebase.database();
let pages = db.ref();

class Firebase {

    inputPageToDB (page){
        pages.child(page.pageId).set(page);

    let pageRef = firebase.database().ref(page.pageId);
    pageRef.once('value').then(function(snapshot) {
      var email = snapshot.val().email;
      console.log(email);
    });
    };
    
};

module.exports = new Firebase();
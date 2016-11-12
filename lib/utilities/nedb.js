var Datastore = require('nedb');
var db = new Datastore({filename : 'users'});
db.loadDatabase();
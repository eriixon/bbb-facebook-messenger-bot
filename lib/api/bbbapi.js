'use strict';
let https = require('https');
// BBB API searching: the object takes Session object and return array of businesses
class BBBapi {
// MAKE A LIST WITH OPTIONS FROM SESSION AND RETURN IT TO BOT
  createList (session, callback){
    let messageData = {};
    let link = this.makeLink(session);
    this.callBBBapi(link, list => {
      if (!list || list.length === 0) list = false;
      callback(list);
    });
  }
// CREATE A NEW PATH FOR REQUEST
  makeLink(session) {
    let link = '/api/orgs/search?PageSize=250';
      if(session.context.name)      link += '&OrganizationName=' + session.context.name.replace(/ /ig, '+').replace(/'/ig, '');
      if(session.context.city)      link += '&City=' + session.context.city.replace(/ /ig,'+').replace(/'/ig, '');
      if(session.context.state)     link += '&StateProvince=' + session.context.state;
      if(session.context.zip)       link += '&PostalCode='+session.context.zip;
    return link;
  }
// REQUEST TO BBB API
  callBBBapi (path, callback) {
    let options = {host: 'api.bbb.org',port: 443,path: path,method: 'GET',
        headers: {
        'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13',
        'Authorization':process.env.BBB_TOKEN
    }};
    let request = https.request(options, function(response){
        console.log('Status BBB API: ' + response.statusCode);
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (chunk) => body+=chunk);
        response.on('end', function () {
            let nodes = JSON.parse(body);
            if(nodes.TotalResults) console.log("Total Results: " + nodes.TotalResults);
            else console.log(" BBB data is empty ");
            if(nodes.SearchResults) callback(nodes.SearchResults);
            else callback(false);
      });
    });
    request.on('error', (error) => { console.log('***PROBLEM with request: '+error.message); });
    request.end();
  }
}
module.exports = new BBBapi();
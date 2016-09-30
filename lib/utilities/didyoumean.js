'use strict';
var levenshtein = require('levenshtein-edit-distance');
let bbb = require('../api/bbbapi');
let fba = require('../api/fbapi');
let bph = require('../constants/botphrases');

class DidYouMean {
    didYouMean(session) {
        let newList = [];
        let typoName = session.context.name;
        session.context.name = session.context.name.substring(0,Math.floor(typoName.length*0.6));
        bbb.createList(session, list => {
            if(!list || list.length===0) {
                session.context.name = true;
                fba.sendMessage({recipient:{id:session.fbid},message:{text:bph.NOT_FOUND,metadata:"TEXT"}});
            }else {
                for (let i = 0; i < list.length; i++) {
                    typoName = typoName.replace(/\./g, '').replace(/\ /gi,"").replace(/,/gi,"").toLowerCase();
                    let orgName =list[i].OrganizationName.replace(/\./g, '').replace(/\ /gi,"").replace(/,/gi,"").toLowerCase();
                    let distance = levenshtein(orgName, typoName);
                    if(distance<(orgName.length*0.6)) newList.push(list[i]);
                };
                if(newList.length!==0) fba.sendBusinessList(session,newList);
                else fba.sendMessage({recipient:{id:session.fbid},message:{text:bph.NOT_FOUND,metadata:"TEXT"}});
            };
        })
    }
};
module.exports = new DidYouMean();




'use strict';
let CSC  = require('../constants/countryStateCity');
let bph = require('../constants/botphrases');
let usa = require('../api/cityapiUSA');
let fba= require('../api/fbapi');

// This class can validate incoming data from user (names of states, cities, zip)
class LocationValidator {

    validateState(userInput, session) {
        let upperInput = userInput.toUpperCase();
        for (let abbr in CSC) {
            if (upperInput === abbr || upperInput === CSC[abbr].fullName.toUpperCase()) {
                session.context.state = abbr;
                session.context.stateFull = CSC[abbr].fullName;
                session.context.country = CSC[abbr].country;
                session.context.city = true;
                return true;
        }}
    return false;   
    };

    validateCity(userInput, session) {
        // userInput = userInput.toUpperCase();
        let stateCities = CSC[session.context.state].cities;
        let quickReplies = [];
        let cities = [];
        for (let i = 0; i < stateCities.length; i++) {
            // let nameUp = ;
            if(stateCities[i].toUpperCase().indexOf(userInput.toUpperCase())>-1) cities.push(stateCities[i]);
            // let abbr = stateCities[i].substring(0, userInput.length).toUpperCase();
            // if (nameUp === userInput || abbr === userInput) cities.push(stateCities[i]);
        }
        if (cities.length === 0) fba.sendTextMessage(session, bph.SMALL_CITY);
        else {
            cities = (cities.length>9)?cities.slice(0,9):cities;
            cities.forEach(city=>{
                if(city.length>20) city = city.substring(0,20);
                quickReplies.push({content_type: "text", title: city, payload:city})
            });
            quickReplies.push({content_type: "text", title: 'Other', payload: "OTHER"});
            fba.sendMessage(session.pid, {recipient:{id:session.fbid}, message:{text: bph.WHICH_CITY, quick_replies: quickReplies}});
        };

    // validateZip(userInput) {
    //     if (!isNaN(userInput) && userInput.length === 5) return userInput;
    //     return false;
    // }
    }
}

module.exports = new LocationValidator();


'use strict';
let states  = require('../constants/states');
let bph = require('../constants/botphrases');
let usa = require('../api/cityapiUSA');
let fba= require('../api/fbapi');

// This class can validate incoming data from user (names of states, cities, zip)
class LocationValidator {

    // validateZip(userInput) {
    //     if (!isNaN(userInput) && userInput.length === 5) return userInput;
    //     return false;
    // }

    validateState(userInput) {
        let upperInput = userInput.toUpperCase();
        let countryState = false;
        for (let abbr in states.USA) {
            if (upperInput === abbr || upperInput === states.USA[abbr].toUpperCase()) {
                countryState = {};
                countryState.state = abbr;
                countryState.country = "USA";
        }}
        for (let abbr in states.Canada) {
            if (upperInput === abbr || upperInput === states.Canada[abbr].toUpperCase()) {
                countryState = {};
                countryState.state = abbr;
                countryState.country = "Canada";
        }}
        return countryState;
    }

    validateCity(userInput, session) {
        let self = this;
        let sides = {pid:session.pid,uid:session.fbid};// page and user IDs
        if(session.context.country === "USA") {
            usa.getCities(userInput, session.context.state, cityList => {
                if (cityList.length === 0) {
                    fba.sendTextMessage(sides, bph.SMALL_CITY);
                    session.context.foundCity = true;
                }
                else if (cityList.length > 4) fba.sendTextMessage(sides, bph.MANY_CITIES);
                else self.createReplies(cityList, sides);
            });
        } else if (session.context.country === "Canada") {
            // NEEDS API FOR CANADIAN CITIES
            fba.sendTextMessage(sides, "FOR PRESENT IT WORKS ONLY FOR THE USA");
        }
    }

    // Create replies with cities
    createReplies (cityList, sides) {
        let quickReplies = [];
        for (var i = 0; i < cityList.length; i++) {
            quickReplies.push({content_type: "text", title: cityList[i], payload: cityList[i]});
        }
        quickReplies.push({content_type: "text", title: 'Other', payload: "OTHER"});
        fba.sendMessage(sides.pid, {recipient:{id:sides.uid}, message:{text: bph.WHICH_CITY, quick_replies: quickReplies}});
    }
}

module.exports = new LocationValidator();


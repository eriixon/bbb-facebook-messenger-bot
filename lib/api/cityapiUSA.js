'use strict';
const http = require('http');
// Request for looking for cities in the USA by the state
class CityApi {
    getCities(userInput, state, callback) {
        let requestUrl = "http://api.sba.gov/geodata/city_links_for_state_of/" + state + ".json";
        let request = http.get(requestUrl, function (response) {
            let body = "";
            response.on("data", (chunk) => body += chunk);
            response.on("end", function () {
                if (response.statusCode === 200) {
                    let cityData = JSON.parse(body);
                    let cityList = makeCityList(userInput, cityData);
                    callback(cityList);
                } else console.log("Status code error: " + response.statusCode);
            });
        });
        request.on('error', (error) => { console.log('Problem with request: ' + error.message); });
    }
}

function makeCityList (userInput, cityData) {
    let cities = [];
    userInput = userInput.toUpperCase();

    for (let i = 0; i < cityData.length; i++) {
        let nameUp = cityData[i].name.toUpperCase();
        let abbr = cityData[i].name.substring(0, userInput.length).toUpperCase();
        if (nameUp === userInput || abbr === userInput) cities.push(cityData[i].name);
    }
    return cities;
}

module.exports = new CityApi();
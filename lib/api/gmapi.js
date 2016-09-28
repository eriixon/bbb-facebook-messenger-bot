'use strict';
let googleMapsClient = require('@google/maps').createClient({key:process.env.GM_KEY});

// Google Maps API for searching city and state by users` coordinates
class MapsApi {
  findCityState(coordinates, callback) {
    googleMapsClient.reverseGeocode({
        result_type: "postal_code",
        latlng: { latitude: coordinates.lat, longitude: coordinates.long }
      }, (err, response) => {
      if (!err) {
          console.log(`Current address id ${response.json.results[0].formatted_address}`);
          let cityState = {};
          let addressComponents = response.json.results[0].address_components;
          for (let i = 0; i < addressComponents.length; i++) {
            let currentComp = addressComponents[i];
            let compTypes = currentComp.types;
            for (let j = 0; j < compTypes.length; j++) {
              let currentType = compTypes[j];
              if (currentType === "locality") cityState.city = currentComp.short_name;
              else if (currentType === "administrative_area_level_1") cityState.state = currentComp.short_name;
              else if (currentType === "country") cityState.country = currentComp.short_name;
            }
          }
          callback(cityState);
      }});
}};

module.exports = new MapsApi();
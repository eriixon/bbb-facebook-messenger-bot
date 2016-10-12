'use strict';
const config = require('config');
let googleMapsClient = require('@google/maps').createClient({key:config.get('GM_KEY')});

// Google Maps API for searching city and state by users` coordinates
class MapsApi {
  findCityState(coordinates, session, callback) {
    googleMapsClient.reverseGeocode({
        result_type: "postal_code",
        latlng: { latitude: coordinates.lat, longitude: coordinates.long }
      }, (err, response) => {
      if (!err) {
          console.log(`Current address id ${response.json.results[0].formatted_address}`);
          let addressComponents = response.json.results[0].address_components;
          for (let i = 0; i < addressComponents.length; i++) {
            let currentComp = addressComponents[i];
            let compTypes = currentComp.types;
            for (let j = 0; j < compTypes.length; j++) {
              let currentType = compTypes[j];
              if (currentType === "locality") session.context.city = currentComp.short_name;
              else if (currentType === "administrative_area_level_1") {
                    session.context.state = currentComp.short_name;
                    session.context.stateFull = currentComp.long_name;
              } else if (currentType === "country") session.context.country = currentComp.short_name;
          }}
          callback(true);
      } else callback(false);
    });
}};

module.exports = new MapsApi();
import {moment} from 'moment';
import mapboxgl from 'mapbox-gl';
import { mapDirection } from './store/index';
mapboxgl.accessToken = process.env.mapboxKey;

export function timer(createdAt){
  return moment().startOf(createdAt).fromNow()
}

export function getUserLocation (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export function filterSpots(filter, spots){
  return Object.keys(filter).length < 1 ? spots : spots.filter( spot => {
    for (var key in filter){
      //when time left is a property then include something like spot.properties[key] < filter[key][0]
      if (filter[key].includes(spot.properties[key]) ){
        return true;
      }
      return false;
    }
  });
}

//Below's function calculates the distance from two geo points as the crow flies or straight-line distance
//Uses the Haversine Formula. More info: https://en.wikipedia.org/wiki/Haversine_formula
//As well as this stack: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong
//We may consider switching this to Google's API
//----------------------------------------------------------------
export function getDistanceFromLatLng(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return round(d, 2);
}
//Mini function used in above formula
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
//Mini function used in above formula
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//function to calculate driving distance in miles
export function drivingDistance(currentlongitude, currentlatitude, spotCoors){
  const mapDirectionAPI = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    interactive: false,
    profile: 'driving',
    controls: {
      profileSwitcher: false
    }
  });
  return new Promise((resolve, reject) => {
    mapDirection.setOrigin([currentlongitude, currentlatitude]);
    mapDirection.setDestination(spotCoors);
    mapDirection.on('route', function(e){
      console.log(e)
      const distanceInMeters = e.route[0].distance;
      resolve(distanceInMeters);
      // console.log('routed', distanceInMiles)
    });
  })
  .then( (meters) => {
    const distanceInMiles = meters * 0.000621371192;
    return distanceInMiles;
  })

}

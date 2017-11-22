import axios from 'axios';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';
import { getUserLocation } from '../helpers';
import socket from '../socket';
import { mapDirection } from './';


/**
 * ACTION TYPES
 */
 const GET_SPOTS = 'GET_SPOTS';

 /**
 * INITIAL STATE
 */
const defaultSpots = [];

/**
 * ACTION CREATORS
 */
const getSpots = spots => ({type: GET_SPOTS, spots});

/**
 * THUNK CREATORS
 */
const fetchAddress = (coor) => {
  const [lat, lng] = coor;
  return axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + lat + ',' + lng + '.json?access_token=' + mapboxgl.accessToken)
  .then(res => res.data)
  .then( data => {
    return data.features[0];
  })
  .catch(err => console.log(err));
};

export const fetchSpots = () =>
  dispatch =>
    axios.get('/api/streetspots')
      .then( res => res.data)
      .then( spotLatLong => {
        return GeoJSON.parse(spotLatLong, {Point: ['latitude', 'longitude']});
      })
      .then(spots => {
        spots.features.forEach(function(spot) {
            fetchAddress(spot.geometry.coordinates)
            .then( place => spot.place_name = place.place_name)
          });
        return dispatch(getSpots(spots || defaultSpots));
      })
      .catch(err => console.log(err));

export const addSpotOnServerGeo = (map, userId, defaultVehicle) =>
  dispatch =>
   getUserLocation()
      .then( position => {
        const { longitude, latitude } = position.coords;

        // spot validation here
        spotValidation([longitude, latitude]);

        const spot = { longitude, latitude, size: defaultVehicle || null } //eventually need to pull in default vehicle
        return axios.post(`/api/streetspots/${ userId }`, spot)})
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err));

export const addSpotOnServerMarker = (map, userId, defaultVehicle, spot) =>
  dispatch => {
    console.log(spot);

    // spot validation here
    const { longitude, latitude } = spot;
    spotValidation([longitude, latitude])

    axios.post(`/api/streetspots/${ userId }`, spot)
        .then( () => dispatch(fetchSpots()))
        .catch(err => console.log(err))
  }


export const deleteSpotOnServer = (spotId) =>
  dispatch =>
    axios.delete(`/api/streetspots/${ spotId }`)
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err));

export const takeSpot = (id, map) =>
  dispatch =>
    axios.put(`/api/streetspots/${ id }`)
    .then(result => result.data)
    .then( reporter => {
      dispatch(fetchSpots());
      if (document.getElementsByClassName("mapboxgl-popup").length > 0) {
        document.getElementsByClassName("mapboxgl-popup")[0].remove();
      }
      console.log(reporter);
      if (reporter.socketId) {
        socket.emit('spot-taken-online', reporter.socketId);
      } else {
        socket.emit('spot-taken-offline', reporter.id);
      }
      mapDirection.removeRoutes();
    })
    .catch( err => console.log(err));

/**
 * REDUCER
 */

export default function (state = defaultSpots, action) {
  switch (action.type) {
    case GET_SPOTS:
      return action.spots;
    default:
      return state;
  }
}



/**
 help function
*/

function fetchGoogleAddress(coor) {
  const [lng, lat] = coor;
  const queryString = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBW_EFFCEHC3ETI49Nx6749KVUgXXHswp8`;
  return axios.get(queryString)
  .then(result => result.data.results[0])
}

function reverseGoogleAddress(current, cross) {
  const queryAddress = `${current} and ${cross}, new york, new york`.split(' ').join('+');
  const queryString = `https://maps.googleapis.com/maps/api/geocode/json?address=${queryAddress}&key=AIzaSyBW_EFFCEHC3ETI49Nx6749KVUgXXHswp8`;
  return axios.get(queryString)
  .then(result => result.data.results[0])
  .then( results => {
    results.currentStreet = current;
    results.intersectStreet = cross;
    return results;
  })
}

function getIntersectionDistance(ori, dest, currStreet, crossStreet) {
  const _ori = ori.replace('&', 'and');
  const _dest = dest.replace('&', 'and');
  return axios.put('/api/intersections/distance', {origin: _ori, destination: _dest})
  .then( result => result.data.rows[0])
  .then( distanceObj => {
    distanceObj.currentStreet = currStreet;
    distanceObj.crossStreet = crossStreet;
    return distanceObj;
  })
}

function parseFtAndMile(str) {
  const arr = str.split(' ');
  if (arr[1] == 'mi'){
    return parseFloat(arr[0]) * 5280;
  }
  return parseFloat(arr[0]);
}

function spotValidation(coor){
  let standPoint;
  let distanceToClosestStreet;
  return fetchGoogleAddress(coor)
  .then( place => {
    console.log(place);
    standPoint = place.formatted_address;
    const currentOn = place.address_components[1].long_name.toUpperCase();
    // find all intersections
    axios.get(`/api/intersections/${currentOn}`)
    .then( result => result.data)
    .then( intersections => {
      console.log(intersections);
      // query google geocoding api to find coor of all intersection
      return Promise.all(
      intersections.map( section => {
        return reverseGoogleAddress(section.currentStreet, section.intersectStreet)
      }))
    })
    .then( streetsAndCoords => {
      console.log(streetsAndCoords);
      const origins = standPoint.split(' ').join('+');
      return Promise.all(
        streetsAndCoords.map( dest => {
          const destination = dest.formatted_address.split(' ').join('+');
          return getIntersectionDistance(origins, destination, dest.currentStreet, dest.intersectStreet);
      }))
    })
    .then( distances => {
      // find the cloest two streets
      distances.sort(function(aDist, bDist){
        return aDist.elements[0].distance.value - bDist.elements[0].distance.value
      })
      console.log(distances);
      distanceToClosestStreet = distances[0].elements[0].distance.text;
      distanceToClosestStreet = parseFtAndMile(distanceToClosestStreet);
      const onStreet = distances[0].currentStreet;
      const street1 = distances[0].crossStreet;
      const street2 = distances[1].crossStreet;
      console.log(`you are on ${onStreet} between ${street1} and ${street2}`)
      // find the corresponding rules
      return axios.put('/api/rules', {onStreet, street1, street2})
      .then(result => result.data);
    })
    .then( totalSigns => {
      console.log(totalSigns);
      const rangeSmall = distanceToClosestStreet - 100 > 0 ? distanceToClosestStreet - 100 : 0;
      const rangeBig = distanceToClosestStreet + 100;
      console.log(`the accuracy is between ${rangeSmall}ft and ${rangeBig}ft`);
      const qualifiedSigns = [];
      totalSigns.forEach( signs => {
        qualifiedSigns.push(signs.filter( sign => parseInt(sign.distance) >= rangeSmall && parseInt(sign.distance) <= rangeBig))
      });
      console.log('following are possible parking rules in this area', qualifiedSigns);
      return qualifiedSigns;
    })
    .catch(err => console.log(err));
  })
}

// even number => south
// odd number => north
// idea to improve accuracy => check total length between intersections

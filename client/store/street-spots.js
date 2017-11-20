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
    return data.features[0].place_name;
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
        // remove existing marker (we can optimize it later)
        const currentMarkers = document.getElementsByClassName("marker");
        while (currentMarkers.length > 0) {
          currentMarkers[0].remove();
        }
        spots.features.forEach(function(spot) {
            fetchAddress(spot.geometry.coordinates)
            .then( place => spot.place_name = place)
          });
        return dispatch(getSpots(spots || defaultSpots));
      })
      .catch(err => console.log(err));

export const addSpotOnServerGeo = (map, userId, defaultVehicle) =>
  dispatch =>
   getUserLocation()
      .then( position => {
        const { longitude, latitude } = position.coords;
        const spot = { longitude, latitude, size: defaultVehicle || null } //eventually need to pull in default vehicle
        return axios.post(`/api/streetspots/${ userId }`, spot)})
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err));

export const addSpotOnServerMarker = (map, userId, defaultVehicle, spot) =>
  dispatch =>
    axios.post(`/api/streetspots/${ userId }`, spot)
        .then( () => dispatch(fetchSpots()))
        .catch(err => console.log(err))


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

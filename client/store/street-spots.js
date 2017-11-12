import axios from 'axios';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';
import socket from '../socket';

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

export const fetchSpots = (map) =>
  dispatch =>
    axios.get('/api/streetspots')
      .then( res => res.data)
      .then( spotLatLong => {
        return GeoJSON.parse(spotLatLong, {Point: ['latitude', 'longitude']});
      })
      .then(spots => {
        spots.features.forEach(function(marker) {
            // create the marker
            var el = document.createElement('div');
            el.className = 'marker';
            // create the popup
            var popup = new mapboxgl.Popup()
                .setText(`Size: ${ spot.properties.size }`);

            new mapboxgl.Marker(el)
            .setLngLat(spot.geometry.coordinates)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
          });
        dispatch(getSpots(spots || defaultSpots));
      })
      .catch(err => console.log(err));

export const addSpot = (spot, userId) =>
  dispatch =>
    axios.post(`/api/streetspots/${ userId }`, spot)
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err));

export const deleteSpot = (spotId) =>
  dispatch =>
    axios.delete(`/api/streetspots/${ spotId }`)
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err));

export const takeSpot = (id) =>
  dispatch =>
    axios.put(`/api/streetspots/${ id }`)
    .then(result => result.data)
    .then( reporter => {
      dispatch(fetchSpots())
      console.log(reporter);
      if (reporter.socketId) {
        socket.emit('spot-taken-online', reporter.socketId);
      } else {
        socket.emit('spot-taken-offline', reporter.id);
      }
    })
    .catch( err => console.log(err))

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

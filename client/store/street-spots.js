import axios from 'axios';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';

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

export const fetchSpots = (component) =>
  dispatch =>
    axios.get('/api/streetspots')
      .then( res => res.data)
      .then( spotLatLong => {
        return GeoJSON.parse(spotLatLong, {Point: ['latitude', 'longitude']});
      })
      .then(spots => {
        spots.features.forEach(function(marker) {
            var el = document.createElement('div');
            el.className = 'marker';

            new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(component);
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

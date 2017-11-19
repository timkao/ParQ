import axios from 'axios';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';

/**
 * ACTION TYPES
 */
 const GET_LOTS = 'GET_LOTS';

 /**
 * INITIAL STATE
 */
const defaultLots = [];

/**
 * ACTION CREATORS
 */
const getLots = lots => ({type: GET_LOTS, lots});

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

export const fetchLots = () =>
  dispatch =>
    axios.get('/api/lots')
      .then( res => res.data)
      .then( spotLatLong => {
        return GeoJSON.parse(spotLatLong, {Point: ['latitude', 'longitude']});
      })
      .then(lots => {
        console.log(lots);
        // remove existing marker (we can optimize it later)
        const currentMarkers = document.getElementsByClassName('lot');
        while (currentMarkers.length > 0) {
          currentMarkers[0].remove();
        }
        lots.features.forEach(function(lot) {
            fetchAddress(lot.geometry.coordinates)
            .then( place => lot.place_name = place);
          });
        return dispatch(getLots(lots));
      })
      .catch(err => console.log(err));

/**
 * REDUCER
 */

export default function (state = defaultLots, action) {
  switch (action.type) {
    case GET_LOTS:
      return action.lots;
    default:
      return state;
  }
}

import mapboxgl from 'mapbox-gl';
import '../../secrets';
import { fetchSpots } from './index';

const getUserLocation = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};
const GET_MAP = 'GET_MAP';

const getMap = map => ({type: GET_MAP, map});


export const fetchMap = (component) => {
  return function (dispatch) {
    mapboxgl.accessToken = process.env.mapboxKey;

    getUserLocation()
      .then((position) => {
        const { longitude, latitude } = position.coords;
        component.setState({ currentLat: longitude, currentLong: latitude });
        // this.map.setCenter([longitude, latitude]);
        component.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [longitude, latitude],
          zoom: 15
        });
        component.map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
        component.map.scrollZoom.disable();
        component.map.addControl(new mapboxgl.NavigationControl());
        dispatch(getMap(component.map));
      })
      .then( () => {
        dispatch(fetchSpots(component.map));
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
};

export default function (state = {}, action) {
  switch (action.type) {
    case GET_MAP:
      return action.map;
    default:
      return state;
  }
}

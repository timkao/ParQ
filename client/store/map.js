import mapboxgl from 'mapbox-gl';
import '../../secrets';
import store, { updateSpotsTaken, fetchSpots, getHeadingTo } from './';

const getUserLocation = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};
const GET_MAP = 'GET_MAP';

const getMap = map => ({ type: GET_MAP, map });


mapboxgl.accessToken = process.env.mapboxKey;

export const mapDirection = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
  interactive: false,
  profile: 'driving',
  controls: {
    profileSwitcher: false
  }
});// MapboxDirections Object is from index.html

export const mapGeocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken
})  // MapboxGeocoder Object is from index.html

export let longitude;
export let latitude;

export const fetchMap = (component) => {
  return function (dispatch) {
    getUserLocation()
      .then(position => {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        component.setState({ currentLat: longitude, currentLong: latitude });

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

        // remove profile
       
        component.map.scrollZoom.disable();
        component.map.addControl(new mapboxgl.NavigationControl());
        dispatch(getMap(component.map));
        return dispatch(fetchSpots(component.map))
          })
          .then(() => {
        // add search box
        component.map.addControl(mapGeocoder, 'top-left');

        // place a marker when the search result comes out and remove the previous one if any
        mapGeocoder.on('result', (ev) => {
          component.map.getSource('single-point').setData(ev.result.geometry);
        })

        // add mapDirection
        component.map.addControl(mapDirection, 'top-right');

        component.map.on('load', function () {
          // source of search marker
          component.map.addSource('single-point', {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": []
            }
          });

          // draw point to search result
          component.map.addLayer({
            "id": "point",
            "source": "single-point",
            "type": "circle",
            "paint": {
              "circle-radius": 10,
              "circle-color": "#007cbf"
            }
          });
        })

        // remove profile and direction panel
        document.getElementsByClassName('mapbox-directions-clearfix')[0].remove();
        document.getElementsByClassName('mapbox-directions-component-keyline')[0].remove();

        // stop loading icon when everything is done
        component.setState({ loaded: true });

        // show notification for 4 seconds and then remove it

        // const spotsTaken = store.getState().user.spotsTaken;
        // if (spotsTaken) {
        //   component.setState({
        //     showNotification: { isShow: true, message: `${spotsTaken} spot${spotsTaken > 1 ? 's' : ''} you reported ${spotsTaken > 1 ? 'are' : 'is'} taken! You earned ${spotsTaken * 100} points` }
        //   });
        //   setTimeout(() => {
        //     component.setState({ showNotification: { isShow: false, message: '' } });
        //     dispatch(updateSpotsTaken());
        //   }, 4000);
        // }


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

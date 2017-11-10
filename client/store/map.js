import mapboxgl from 'mapbox-gl';
import '../../secrets';

const getUserLocation = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export const fetchMap = (component) => {
  return function (dispatch) {
    mapboxgl.accessToken = process.env.mapboxKey;
    // mapboxgl.accessToken = 'pk.eyJ1IjoiZ21lZGluYTIyOSIsImEiOiJjajlscHRhbXY0a2s4MzNxbXUxejBmY3ZqIn0.nAyOpUGA9NDN6tDGg_i6PQ';

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

      })
      .catch((err) => {
        console.error(err.message);
      });
  }
}

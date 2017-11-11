import mapboxgl from 'mapbox-gl';
import '../../secrets';
import store, { updateSpotsTaken } from './';

const getUserLocation = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

mapboxgl.accessToken = process.env.mapboxKey;

export const mapDirection = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
  interactive: false,
  profile: 'driving',
  controls: {
    profileSwitcher: false
  }
})  // MapboxDirections Objecr is from index.html

export const mapGeocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken
})  // MapboxGeocoder Objecr is from index.html

export const fetchMap = (component) => {
  return function (dispatch) {
    getUserLocation()
      .then((position) => {
        const { longitude, latitude } = position.coords;
        component.setState({ currentLat: longitude, currentLong: latitude });
        const currentSpots = store.getState().streetspots;
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [longitude, latitude],
          zoom: 15
        });

        map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

        // add search box
        map.addControl(mapGeocoder, 'top-left');

        // place a marker when the search result comes out and remove the previous one if any
        mapGeocoder.on('result', (ev) => {
          map.getSource('single-point').setData(ev.result.geometry);
        })

        // add mapDirection
        map.addControl(mapDirection, 'top-right');

        map.on('load', function () {
          // source of search marker
          map.addSource('single-point', {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": []
            }
          });

          // draw point to search result
          map.addLayer({
            "id": "point",
            "source": "single-point",
            "type": "circle",
            "paint": {
              "circle-radius": 10,
              "circle-color": "#007cbf"
            }
          });

          // example I use to test "notification"
          map.addLayer({
            "id": "places",
            "type": "symbol",
            "source": {
              "type": "geojson",
              "data": {
                "type": "FeatureCollection",
                "features": [{
                  "type": "Feature",
                  "properties": {
                    "description": "<strong>A Little Night Music</strong><p>The Arlington Players' production of Stephen Sondheim's  <a href=\"http://www.thearlingtonplayers.org/drupal-6.20/node/4661/show\" target=\"_blank\" title=\"Opens in a new window\"><em>A Little Night Music</em></a> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>",
                    "icon": "music",
                    "id": currentSpots[2].id  // test notifications
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [-73.999572, 40.750955],
                  }
                }, {
                  "type": "Feature",
                  "properties": {
                    "description": "<strong>Truckeroo</strong><p><a href=\"http://www.truckeroodc.com/www/\" target=\"_blank\">Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>",
                    "icon": "music"
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [-73.992729, 40.75220700000001]
                  }
                }]
              }
            },
            "layout": {
              "icon-image": "{icon}-15",
              "icon-allow-overlap": true
            }
          });
        })

        // onclick and change the "headingTo" target
        map.on('click', 'places', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
          component.setState({ headingTo: e.features[0].properties.id });
          mapDirection.setOrigin([longitude, latitude]);
          mapDirection.setDestination(e.features[0].geometry.coordinates);
        });

        // event listener to change cursor
        map.on('mouseenter', 'places', function () {
          map.getCanvas().style.cursor = 'pointer';
        });

        // event listener to change cursor
        map.on('mouseleave', 'places', function () {
          map.getCanvas().style.cursor = '';
        });

        // remove profile and direction panel
        document.getElementsByClassName('mapbox-directions-clearfix')[0].remove();
        document.getElementsByClassName('mapbox-directions-component-keyline')[0].remove();

        // stop loading icon when everything is done
        component.setState({ loaded: true });

        // show notification for 4 seconds and then remove it
        const spotsTaken = store.getState().user.spotsTaken;
        if (spotsTaken) {
          component.setState({
            showNotification: { isShow: true, message: `${spotsTaken} spot${spotsTaken > 1 ? 's' : ''} you reported ${spotsTaken > 1 ? 'are' : 'is'} taken! You earned ${spotsTaken * 100} points` }
          });
          setTimeout(() => {
            component.setState({ showNotification: { isShow: false, message: '' } });
            dispatch(updateSpotsTaken());
          }, 4000);
        }

      })
      .catch((err) => {
        console.error(err.message);
      });
  }
}

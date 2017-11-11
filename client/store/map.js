import mapboxgl from 'mapbox-gl';
import '../../secrets';
import store, { fetchSpots } from './';

const getUserLocation = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

mapboxgl.accessToken = process.env.mapboxKey;

export const mapDirection = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
  profile: 'driving',
  controls: {
    profileSwitcher: false
  }
})  // MapboxDirections Objecr is from index.html

export const fetchMap = (component) => {
  return function (dispatch) {
    getUserLocation()
      .then((position) => {
        const { longitude, latitude } = position.coords;
        component.setState({ currentLat: longitude, currentLong: latitude });
        console.log(store.getState().streetspots);
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
        // map.scrollZoom.disable();

        map.addControl(mapDirection);
        mapDirection.setOrigin([longitude, latitude]);

        map.on('load', function () {
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
                    "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
                    "icon": "theatre"
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [-74.01153299999999, 40.7152989]
                  }
                }, {
                  "type": "Feature",
                  "properties": {
                    "description": "<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist <a href=\"http://www.muhsinah.com\" target=\"_blank\" title=\"Opens in a new window\">Muhsinah</a> plays the <a href=\"http://www.blackcatdc.com\">Black Cat</a> (1811 14th Street NW) tonight with <a href=\"http://www.exitclov.com\" target=\"_blank\" title=\"Opens in a new window\">Exit Clov</a> and <a href=\"http://godsilla.bandcamp.com\" target=\"_blank\" title=\"Opens in a new window\">Gods’illa</a>. 9:00 p.m. $12.</p>",
                    "icon": "music"
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [-73.98670679999998, 40.73336740000001]
                  }
                }, {
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

        map.on('click', 'places', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
          component.setState({ headingTo: e.features[0].properties.id });
        });

        map.on('mouseenter', 'places', function () {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'places', function () {
          map.getCanvas().style.cursor = '';
        });

        // remove profile and direction panel
        document.getElementsByClassName('mapbox-directions-clearfix')[0].remove();
        document.getElementsByClassName('mapbox-directions-component-keyline')[0].remove();

        // stop loading icon when everything is done
        component.setState({ loaded: true });

        // use store to access notifications
        // show notifications
        // hide notifications after 4 seconds.

      })
      .catch((err) => {
        console.error(err.message);
      });
  }
}

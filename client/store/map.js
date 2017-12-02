import mapboxgl from 'mapbox-gl';
//import '../../secrets';
import store, { fetchLots, fetchSpots } from './';
import { getDistanceFromLatLng, getUserLocation} from '../helpers';

/**
 * API ACCESS
 */
mapboxgl.accessToken = mapboxKey;

// This function is not fully implemented
const createDraggablePoint = (map, event) => {
  // Holds mousedown state for events. if this
  // flag is active, we move the point on `mousemove`.
  var isDragging;
  var coords = event.lngLat;

  //First we check to see if user is trying to create
  //another point on map and instead of dragging current one
  let exists = map.getStyle().layers.find((layer) => layer.id === 'createdPoint')

  //Then we check to see if the user is clicking on a currently labeled open spot (no need for a click marker)
  let streetSpotLayer = map.getSource('streetspots') || null //Making sure the streetspots layer was added
  // let existsSpot
  //We look through the layer data and search the straight-lin distance between the click and the spot
  //More information about these functions in ../helpers
  if (streetSpotLayer) {
   let existsSpot =
    streetSpotLayer._data.features
      .filter((source) => {
          return getDistanceFromLatLng(coords.lat,coords.lng,source.geometry.coordinates[1],source.geometry.coordinates[0]) === 0
        })
    //If the clicked point vs streetspot distance is 0, we break out of the entire function
    //as to not create another click point
    if (existsSpot.length) return
  }
  //If exists is true, we remove the created click point to create a new one
  //note we need to remove the source as well
  if (exists) {
    map.removeLayer(exists.id)
    map.removeSource(exists.id)
  }

  // Is the cursor over a point? if this
  // flag is active, we listen for a mousedown event.
  var isCursorOverPoint;
  var coordinates = document.getElementById('coordinates');
  var canvas = map.getCanvasContainer();

  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [coords.lng, coords.lat]
          }
      }]
  };

  function mouseDown() {
      if (!isCursorOverPoint) return;

      isDragging = true;

      // Set a cursor indicator
      canvas.style.cursor = 'grab';

      // Mouse events
      map.on('mousemove', onMove);
      map.once('mouseup', onUp);
  }

  function onMove(e) {
      if (!isDragging) return;
      var coords = e.lngLat;

      // Set a UI indicator for dragging.
      canvas.style.cursor = 'grabbing';

      // Update the Point feature in `geojson` coordinates
      // and call setData to the source layer `point` on it.
      geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
      map.getSource('createdPoint').setData(geojson);
  }

  function onUp(e) {
      if (!isDragging) return;
      var coords = e.lngLat;

      // Print the coordinates of where the point had
      // finished being dragged to on the map.
      coordinates.style.display = 'block';
      coordinates.innerHTML = 'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
      canvas.style.cursor = '';
      isDragging = false;

      // Unbind mouse events
      map.off('mousemove', onMove);
  }

  // Add a single point to the map
  map.addSource('createdPoint', {
      "type": "geojson",
      "data": geojson
  });

  map.addLayer({
      "id": "createdPoint",
      "type": "circle",
      "source": "createdPoint",
      "paint": {
          "circle-radius": 10,
          "circle-color": "#3887be"
      },
  });

  // When the cursor enters a feature in the point layer, prepare for dragging.
  map.on('mouseenter', 'createdPoint', function() {
      map.setPaintProperty('createdPoint', 'circle-color', '#3bb2d0');
      canvas.style.cursor = 'move';
      isCursorOverPoint = true;
      map.dragPan.disable();
  });

  map.on('mouseleave', 'createdPoint', function() {
      map.setPaintProperty('createdPoint', 'circle-color', '#3887be');
      canvas.style.cursor = '';
      isCursorOverPoint = false;
      map.dragPan.enable();
  });

  map.on('mousedown', mouseDown);
}


/**
 * ACTION TYPES
 */
const GET_MAP = 'GET_MAP';

/**
 * ACTION CREATORS
 */
const getMap = map => ({ type: GET_MAP, map });

/**
 * THUNK CREATORS
 */
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
        // component.setState({ currentLat: longitude, currentLong: latitude });

        component.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/light-v9',
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
        dispatch(fetchLots());
        dispatch(fetchSpots());
      })
      .then(() => {
        // add search box
        component.map.addControl(mapGeocoder, 'top-left');
        // place a marker when the search result comes out and remove the previous one if any
        mapGeocoder.on('result', (ev) => {
          component.map.getSource('single-point').setData(ev.result.geometry);
        });

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

        // add draggable point
        // used for creating spots on demand
        // see helper function above
        var firstClick = true;
        component.map.on('click', function (e) {
          // if (firstClick) {
            createDraggablePoint(component.map, e)
          //   firstClick = false
          // }
        });


        // remove profile and direction panel
        document.getElementsByClassName('mapbox-directions-clearfix')[0].remove();
        document.getElementsByClassName('mapbox-directions-component-keyline')[0].remove();
        // stop loading icon when everything is done
        component.setState({ loaded: true });
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

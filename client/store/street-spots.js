import axios from 'axios';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';
import { getUserLocation, spotValidation } from '../helpers';
import socket from '../socket';
import { mapDirection, getSigns, getReportSpot } from './';

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
export const getSpots = spots => ({ type: GET_SPOTS, spots });

/**
 * THUNK CREATORS
 */
const fetchAddress = (coor) => {
  const [lat, lng] = coor;
  return axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + lat + ',' + lng + '.json?access_token=' + mapboxgl.accessToken)
    .then(res => res.data)
    .then(data => {
      return data.features[0];
    })
    .catch(err => console.log(err));
};

export const fetchSpots = () =>
  dispatch =>
    axios.get('/api/streetspots')
      .then(res => res.data)
      .then(spotLatLong => {
        return GeoJSON.parse(spotLatLong, { Point: ['latitude', 'longitude'] });
      })
      .then(spots => {
        spots.features.forEach(function (spot) {
          fetchAddress(spot.geometry.coordinates)
            .then(place => spot.place_name = place.place_name)
        });
        return dispatch(getSpots(spots || defaultSpots));
      })
      .catch(err => console.log(err));

export const addSpotOnServerGeo = (map, userId) =>
  dispatch => {
    return getUserLocation()
      .then(position => {
        const { longitude, latitude } = position.coords;
        const spot = { longitude, latitude }
        // spot validation here
        return spotValidation([longitude, latitude])
          .then(({ totalSigns, mainStreet, crossStreet1, crossStreet2, fromS, gotoS }) => {
            spot.mainStreet = mainStreet;
            spot.crossStreet1 = crossStreet1;
            spot.crossStreet2 = crossStreet2;
            spot.fromStreet = fromS;
            spot.gotoStreet = gotoS;
            let signsForDispatch = [];
            if (totalSigns) {
              signsForDispatch = totalSigns.reduce(function (acc, sign) {
                acc = acc.concat(sign);
                return acc;
              }, [])
            }
            dispatch(getSigns(signsForDispatch));
            return axios.post(`/api/streetspots/${userId}`, spot)
          })
          .then(newSpot => dispatch(getReportSpot(newSpot.data)))
          .then(() => {
            dispatch(fetchSpots())
            socket.emit('new-spot-reported');
          })
      })
      .catch(err => console.log(err));
  }

export const addSpotOnServerMarker = (map, userId, defaultVehicle, spot) =>
  dispatch => {
    console.log(spot);
    // spot validation here
    const { longitude, latitude } = spot;
    return spotValidation([longitude, latitude])
      .then(({ totalSigns, mainStreet, crossStreet1, crossStreet2, fromS, gotoS }) => {
        spot.mainStreet = mainStreet;
        spot.crossStreet1 = crossStreet1;
        spot.crossStreet2 = crossStreet2;
        spot.fromStreet = fromS;
        spot.gotoStreet = gotoS;
        console.log('spot with streets', spot);
        let signsForDispatch = [];
        if (totalSigns) {
          signsForDispatch = totalSigns.reduce(function (acc, sign) {
            acc = acc.concat(sign);
            return acc;
          }, [])
        }
        dispatch(getSigns(signsForDispatch));
        return axios.post(`/api/streetspots/${userId}`, spot)
          .then(newSpot => dispatch(getReportSpot(newSpot.data)))
          .then(() => {
            dispatch(fetchSpots())
            socket.emit('new-spot-reported');
          })
      })
      .catch(err => console.log(err))
  }


export const deleteSpotOnServer = (spotId) =>
  dispatch =>
    axios.delete(`/api/streetspots/${spotId}`)
      .then(() => dispatch(fetchSpots()))
      .catch(err => console.log(err));

export const takeSpot = (id, map) =>
  dispatch =>
    axios.put(`/api/streetspots/${id}`)
      .then(result => result.data)
      .then(reporter => {
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
      .catch(err => console.log(err));

export const updateSpotSizeAndPic = (id, size, pictures) => {
  return (dispatch) => {
    return axios.put(`/api/streetspots/${id}/size`, { size })
      .then(() => {
        if (pictures) {
          return axios.put(`/api/streetspots/${id}/pictures`, { pictures })
        } else {
          return null
        }
      })
      .then(() => dispatch(fetchSpots()))
      .catch(err => console.log(err));
  }
}

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


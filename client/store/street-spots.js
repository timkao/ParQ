import axios from 'axios';
import GeoJSON from 'geojson';
import mapboxgl from 'mapbox-gl';
import { getUserLocation } from '../helpers';
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
const getSpots = spots => ({ type: GET_SPOTS, spots });

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
          .then(signs => {
            let signsForDispatch = [];
            if (signs) {
              signsForDispatch = signs.reduce(function (acc, sign) {
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
      .then(signs => {
        let signsForDispatch = [];
        if (signs) {
          signsForDispatch = signs.reduce(function (acc, sign) {
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

export const updateSpotSize = (id, size) => {
  return (dispatch) => {
    return axios.put(`/api/streetspots/${id}/size`, { size })
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


/**
 help function
*/

function fetchGoogleAddress(coor) {
  const [lng, lat] = coor;
  const queryString = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBW_EFFCEHC3ETI49Nx6749KVUgXXHswp8`;
  return axios.get(queryString)
    .then(result => result.data.results[0])
}

function reverseGoogleAddress(current, cross) {
  const queryAddress = `${current} and ${cross}, new york, new york`.split(' ').join('+');
  const queryString = `https://maps.googleapis.com/maps/api/geocode/json?address=${queryAddress}&key=AIzaSyBW_EFFCEHC3ETI49Nx6749KVUgXXHswp8`;
  return axios.get(queryString)
    .then(result => result.data.results[0])
    .then(results => {
      if (results) {
        results.currentStreet = current;
        results.intersectStreet = cross;
      }
      return results;
    })
}

function getIntersectionDistance(ori, dest, currStreet, crossStreet) {
  const _ori = ori.replace('&', 'and');
  const _dest = dest.replace('&', 'and');
  return axios.put('/api/intersections/distance', { origin: _ori, destination: _dest })
    .then(result => result.data.rows[0])
    .then(distanceObj => {
      distanceObj.currentStreet = currStreet;
      distanceObj.crossStreet = crossStreet;
      return distanceObj;
    })
}

function parseFtAndMile(str) {
  const arr = str.split(' ');
  if (arr[1] == 'mi') {
    return parseFloat(arr[0]) * 5280;
  }
  return parseFloat(arr[0]);
}

function findClosestStreets(tempArr) {
  const longestDistance = parseFtAndMile(tempArr[1].elements[0].distance.text);
  console.log('the longest distance: ', longestDistance);
  // validate longest distance
  const onStreet = tempArr[0].currentStreet;
  const street1 = tempArr[0].crossStreet;
  const street2 = tempArr[1].crossStreet;
  const origin = `${onStreet} and ${street1}, new york, new york`.split(' ').join('.');
  const destination = `${onStreet} and ${street2}, new york, new york`.split(' ').join('.');
  return getIntersectionDistance(origin, destination)
    .then(distanceObj => {
      const sectionLength = parseFtAndMile(distanceObj.elements[0].distance.text);
      console.log('the longest distance should be smaller than', sectionLength);
      return sectionLength >= longestDistance;
    })
}


function spotValidation(coor) {
  let standPoint;
  let distanceToClosestStreet;
  let distanceToFarStreet;
  let allsigns = [];
  let mainStreet, crossStreet1, crossStreet2;
  return fetchGoogleAddress(coor)
    .then(place => {
      console.log('current locaiton: ', place);
      standPoint = place.formatted_address;
      const currentOn = place.address_components[1].long_name.toUpperCase();
      // find all intersections
      return axios.get(`/api/intersections/${currentOn}`)
        .then(result => result.data)
        .then(intersections => {
          console.log('all intersections: ', intersections);
          // query google geocoding api to find coor of all intersection
          return Promise.all(
            intersections.map(section => {
              return reverseGoogleAddress(section.currentStreet, section.intersectStreet)
            }))
        })
        .then(streetsAndCoords => {
          console.log('streets and coord: ', streetsAndCoords);
          streetsAndCoords = streetsAndCoords.filter(ele => ele !== undefined);
          const origins = standPoint.split(' ').join('+');
          return Promise.all(
            streetsAndCoords.map(dest => {
              const destination = dest.formatted_address.split(' ').join('+');
              return getIntersectionDistance(origins, destination, dest.currentStreet, dest.intersectStreet);
            }))
        })
        .then(distances => {
          distances.sort(function (aDist, bDist) {
            return aDist.elements[0].distance.value - bDist.elements[0].distance.value
          })
          console.log('sort by distances: ', distances);
          distanceToClosestStreet = parseFtAndMile(distances[0].elements[0].distance.text);

          // if (distances.length > 3)
          const onStreet = distances[0].currentStreet;
          const street1 = distances[0].crossStreet;
          const street2 = distances[1].crossStreet;
          const street3 = distances[2].crossStreet;

          // find the cloest two streets
          return findClosestStreets(distances)
            .then(bool => {
              if (bool) {
                console.log(`you are on ${onStreet} between ${street1} and ${street2}`)
                distanceToFarStreet = parseFtAndMile(distances[1].elements[0].distance.text);
                mainStreet = onStreet;
                crossStreet1 = street1;
                crossStreet2 = street2;
                return axios.put('/api/rules', { mainStreet, crossStreet1, crossStreet2 })
                  .then(result => result.data);
              } else {
                console.log(`you are on ${onStreet} between ${street1} and ${street3}`)
                distanceToFarStreet = parseFtAndMile(distances[2].elements[0].distance.text);
                mainStreet = onStreet;
                crossStreet1 = street1;
                crossStreet2 = street3;
                return axios.put('/api/rules', { mainStreet, crossStreet1, crossStreet2 })
                  .then(result => result.data);
              }
            })
            .then(signsFromCloseToFar => {
              console.log('all signs: ', signsFromCloseToFar);
              const rangeSmall = distanceToClosestStreet - 70 > 0 ? distanceToClosestStreet - 70 : 0;
              const rangeBig = distanceToClosestStreet + 70;
              console.log(`the accuracy is between ${rangeSmall}ft and ${rangeBig}ft`);
              // find remove the signs smaller than lower limit
              signsFromCloseToFar.forEach(signs => {
                allsigns.push(signs.filter(sign => parseInt(sign.distance) >= rangeSmall))
              });
              // find the upper limit
              let upperlimit = allsigns[0].reduce(function(memo, sign){
                const newDistance = parseInt(sign.distance);
                if (memo == rangeBig) {
                  return rangeBig
                } else if (newDistance - rangeBig > 0){
                  if ((newDistance - rangeBig) < (memo - rangeBig)) {
                    return newDistance
                  } else {
                    return memo
                  }
                } else {
                  return memo
                }
              }, rangeSmall);
              upperlimit = upperlimit < rangeBig ? rangeBig : upperlimit;
              console.log('upper limit: ', upperlimit);
              allsigns = allsigns[0].filter(sign => parseInt(sign.distance) <= upperlimit)
              return allsigns;
            })
        })
        .then(totalSigns => {
          // maybe rule too...
          // console.log('all signs: ', totalSigns);
          // const rangeSmall = distanceToClosestStreet - 70 > 0 ? distanceToClosestStreet - 70 : 0;
          // const rangeBig = distanceToClosestStreet + 70;
          // console.log(`the accuracy is between ${rangeSmall}ft and ${rangeBig}ft`);
          // const qualifiedSigns = [];
          // totalSigns.forEach(signs => {
          //   qualifiedSigns.push(signs.filter(sign => parseInt(sign.distance) >= rangeSmall && parseInt(sign.distance) <= rangeBig))
          // });
          console.log('following are possible parking rules in this area', totalSigns);
          // return qualifiedSigns;
          return totalSigns
        })
        .catch(err => console.log(err));
    })
}

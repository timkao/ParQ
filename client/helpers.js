import {moment} from 'moment'

export function timer(createdAt){
  return moment().startOf(createdAt).fromNow()
}

export function getUserLocation (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export function filterSpots(filter, spots){
  return Object.keys(filter).length < 1 ? spots : spots.filter( spot => {
    for (var key in filter){
      //when time left is a property then include something like spot.properties[key] < filter[key][0]
      if (filter[key].includes(spot.properties[key]) ){
        return true;
      }
      return false;
    }
  });
}
import {moment} from 'moment'

export function timer(createdAt){
  return moment().startOf(createdAt).fromNow()
}

export function getUserLocation (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

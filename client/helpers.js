import {moment} from 'moment'

export function timer(createdAt){
  return moment().startOf(createdAt).fromNow()
}

import axios from 'axios'

/**
 * ACTION TYPES
 */
 const GET_SPOTS = 'GET_SPOTS'

 /**
 * INITIAL STATE
 */
const defaultSpots = []

/**
 * ACTION CREATORS
 */
const getSpots = spots => ({type: GET_SPOTS, spots})

/**
 * THUNK CREATORS
 */

export const fetchSpots = () =>
  dispatch =>
    axios.get('/api/streetspots')
      .then( res =>
        dispatch(getSpots(res.data || defaultSpots)))
      .catch(err => console.log(err))

export const addSpot = (spot, userId) =>
  dispatch =>
    axios.post(`/api/streetspots/${ userId }`, spot)
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err))

export const deleteSpot = (spotId) =>
  dispatch =>
    axios.delete(`/api/streetspots/${ spotId }`)
      .then( () => dispatch(fetchSpots()))
      .catch(err => console.log(err))

/**
 * REDUCER
 */

export default function (state = defaultSpots, action) {
  switch (action.type) {
    case GET_SPOTS:
      return action.spots
    default:
      return state
  }
}

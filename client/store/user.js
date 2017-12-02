import axios from 'axios';
import socket from '../socket';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })
const removeUser = () => ({ type: REMOVE_USER })

/**
 * THUNK CREATORS
 */
export const me = () =>
  dispatch =>
    axios.get('/auth/me')
      .then(res => {
        dispatch(getUser(res.data || defaultUser))
        socket.emit('user-login', res.data.id);
      })
      .catch(err => console.log(err))

export const auth = (email, password, method, history) =>
  dispatch =>
    axios.post(`/auth/${method}`, { email, password })
      .then(res => {
        dispatch(me());
        history.push('/home')
      })
      .catch(error =>
        dispatch(getUser({ error })))

export const logout = (history) =>
  dispatch =>
    axios.post('/auth/logout')
      .then(res => {
        dispatch(removeUser())
        history.push('/login')
      })
      .catch(err => console.log(err))

export const updateSpotsTaken = () =>
  dispatch =>
    axios.put('/api/users/updateSpotsTaken')
    .then(result => result.data)
    .then( user => {
      dispatch(getUser(user));
    })
    .catch(err => console.log(err));

export const updateUserPoints = (num) => {
  return (dispatch) => {
    return axios.put(`/api/users/updatePoints`, {num})
    .then(result => result.data )
    .then( user => {
      dispatch(getUser(user));
    })
    .catch(err => console.log(err));
  }
}

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}

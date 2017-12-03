const GET_NOTIFICATION = 'GET_NOTIFICATION';


export const getNotification = (message) => {
  return {
    type: GET_NOTIFICATION,
    message: message
  }
}

/**
 * REDUCER
 */
export default function (state = '', action) {
  switch (action.type) {
    case GET_NOTIFICATION:
      return action.message
    default:
      return state
  }
}

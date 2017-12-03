const GET_LNGLAT = 'GET_LNGLAT';


export const getLnglat = (lnglat) => {
  return {
    type: GET_LNGLAT,
    lnglat: lnglat
  }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case GET_LNGLAT:
      return action.lnglat
    default:
      return state
  }
}

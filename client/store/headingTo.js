const GET_HEADINGTO = 'GET_HEADINGTO';


export const getHeadingTo = (spotId) => {
  return {
    type: GET_HEADINGTO,
    toSpot: spotId
  }
}

/**
 * REDUCER
 */
export default function (state = 0, action) {
  switch (action.type) {
    case GET_HEADINGTO:
      return action.toSpot
    default:
      return state
  }
}

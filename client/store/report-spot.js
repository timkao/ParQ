const GET_REPORTSPOT = 'GET_REPORTSPOT';


export const getReportSpot = (spot) => {
  return {
    type: GET_REPORTSPOT,
    spot: spot
  }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case GET_REPORTSPOT:
      return action.spot
    default:
      return state
  }
}


const GET_SIGNS = 'GET_SIGNS';


export const getSigns = (signs) => {
  return {
    type: GET_SIGNS,
    signs: signs
  }
}

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_SIGNS:
      return action.signs
    default:
      return state
  }
}


const GET_ISSHOW = 'GET_ISSHOW';


export const getIsShow = (bool) => {
  return {
    type: GET_ISSHOW,
    status: bool
  }
}

/**
 * REDUCER
 */
export default function (state = false, action) {
  switch (action.type) {
    case GET_ISSHOW:
      return action.status
    default:
      return state
  }
}

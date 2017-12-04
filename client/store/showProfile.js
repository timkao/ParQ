const GET_SHOWPROFILE = 'GET_SHOWPROFILE';
const HIDE_PROFILE = "HIDE_PROFILE";


export const getShowProfile = (bool) => {
  return {
    type: GET_SHOWPROFILE,
    status: bool
  }
}

export const hideProfile = (bool)=>{
    return {
        type: HIDE_PROFILE,
        status: bool
    }
}

/**
 * REDUCER
 */
export default function (state = false, action) {
  switch (action.type) {
    case GET_SHOWPROFILE:
      return action.status
    case HIDE_PROFILE:
      return action.status
    default:
      return state
  }
}
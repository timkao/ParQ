

/**
 * ACTION TYPES
 */
const GET_FILTER = 'GET_FILTER';
const REMOVE_FILTER = 'REMOVE_USER';

/**
 * INITIAL STATE
 */
const defaultFilter = {distance: [],
  timeAvailable: [],
  size: [],
  type: []
};

/**
 * ACTION CREATORS
 */
const getFilter = filter => ({ type: GET_FILTER, filter });
const removeFilter = () => ({ type: REMOVE_FILTER });

/**
 * THUNK CREATORS
 */
export const setFilter = (filter) =>
  (dispatch) => {
      dispatch(getFilter(filter));
      // .catch(err => console.log(err));
};

export const resetFilter = () =>
(dispatch) => {
    dispatch(removeFilter());
    // .catch(err => console.log(err));
};

/**
 * REDUCER
 */
export default function (state = defaultFilter, action) {
  switch (action.type) {
    case GET_FILTER:
      return action.filter;
    case REMOVE_FILTER:
      return defaultFilter;
    default:
      return state;
  }
}

import {createStore, applyMiddleware, combineReducers} from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import user from './user';
import streetspots from './street-spots';
import map from './map';
import headingTo from './headingTo';
import filter from './filter';
import lots from './lots';
import {loadState} from './localStorage';
import signs from './signs';
import reportspot from './report-spot';

const persistedState = loadState();
const reducer = combineReducers(
	{
    user,
    streetspots,
    map,
    headingTo,
    filter,
    lots,
    signs,
    reportspot
	}
);

const store = createStore(
  reducer, persistedState,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    createLogger()
  ))
);

export default store;

export * from './user';
export * from './map';
export * from './street-spots';
export * from './headingTo';
export * from './filter';
export * from './localStorage';
export * from './lots';
export * from './signs';
export * from './report-spot';


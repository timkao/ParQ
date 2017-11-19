import {createStore, applyMiddleware, combineReducers} from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import user from './user';
import streetspots from './street-spots';
import map from './map';
import headingTo from './headingTo';
import filter from './filter';
import {loadState} from './localStorage';

const persistedState = loadState();
const reducer = combineReducers(
	{
    user,
    streetspots,
    map,
    headingTo,
    filter
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

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store, {saveState} from './store';
import Routes from './routes';

// establishes socket connection
import './socket';

// saves state to localStorage
store.subscribe(() => {
  saveState({filter: store.getState().filter});
});

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('app')
);

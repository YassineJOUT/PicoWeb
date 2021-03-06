import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import getTokenFromStorage from './helpers/getTokenFromStorage';
import { fetchHospitals } from './actionCreators/Hospitals';
import { fetchAllHospitals } from './actionCreators/AllHospitals';
import { fetchAmbulances } from './actionCreators/Ambulances';
import { fetchDrivers } from './actionCreators/Drivers';

import rootReducer from './reducers/index';
import App from './App';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

function initData() {
  const token = getTokenFromStorage();
  console.log(`token : ${token}`);
  if (token) {
    fetchAllHospitals(store.dispatch)
      .then(() => fetchHospitals(store.dispatch))
      .then(() => fetchAmbulances(store.dispatch))
      .then(() => fetchDrivers(store.dispatch));
  }
}

function Main() {
  return (
    <Provider store={store}>
      <App init={initData} />
    </Provider>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));

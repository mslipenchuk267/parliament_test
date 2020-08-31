import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';


import AppNavigator from './navigation/AppNavigator';
import userReducer from './store/reducers/user';

const rootReducer = combineReducers({
  user: userReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));


export default function App() {
  return (
    <Provider store={store} >
      <AppNavigator />
    </Provider>
  );
}

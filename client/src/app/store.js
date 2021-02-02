import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { authReducer } from './reducers/authReducer';
import { roomReducer } from './reducers/roomReducer';

const allReducers = combineReducers({
  authReducer,
  roomReducer,
});

export default process.env.NODE_ENV === 'development'
  ? createStore(allReducers, composeWithDevTools())
  : createStore(allReducers);

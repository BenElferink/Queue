import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { roomReducer } from './roomReducer';

export default combineReducers({
  authReducer,
  roomReducer,
});

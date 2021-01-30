import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

export default process.env.NODE_ENV === 'development'
  ? createStore(reducers, composeWithDevTools())
  : createStore(reducers);

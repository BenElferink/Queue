import React from 'react';
import ReactDOM from 'react-dom';
import './styles/reset.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import { SocketProvider } from './app/SocketContext';

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/reset.css';
import App from './App';
import { TokenProvider } from './contexts/TokenContext';
import { SessionProvider } from './contexts/SessionContext';

ReactDOM.render(
  <React.StrictMode>
    <TokenProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </TokenProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

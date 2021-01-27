import React from 'react';
import ReactDOM from 'react-dom';
import './styles/reset.css';
import App from './App';
import { TokenProvider } from './contexts/TokenContext';
import { SessionProvider } from './contexts/SessionContext';
import { LoggedProvider } from './contexts/LoggedContext';

ReactDOM.render(
  // <React.StrictMode>
  <TokenProvider>
    <SessionProvider>
      <LoggedProvider>
        <App />
      </LoggedProvider>
    </SessionProvider>
  </TokenProvider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

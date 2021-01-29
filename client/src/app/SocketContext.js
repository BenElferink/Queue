import { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const ENDPOINT = 'localhost:4000';
  const socket = io(ENDPOINT);

  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
};

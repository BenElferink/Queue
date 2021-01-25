import { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = (props) => {
  const [session, setSession] = useState({});

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {props.children}
    </SessionContext.Provider>
  );
};

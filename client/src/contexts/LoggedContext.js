import { createContext, useState } from 'react';

export const LoggedContext = createContext();

export const LoggedProvider = (props) => {
  const [logged, setLogged] = useState({
    isLogged: false,
    role: null,
  });

  return (
    <LoggedContext.Provider value={{ logged, setLogged }}>{props.children}</LoggedContext.Provider>
  );
};

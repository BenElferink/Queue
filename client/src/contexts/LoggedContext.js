import { createContext, useState } from 'react';

export const LoggedContext = createContext();

export const LoggedProvider = (props) => {
  const [logged, setLogged] = useState({
    isLogged: false,
    role: null,
    username: '',
  });

  const logoutLogged = () => {
    setLogged({
      isLogged: false,
      role: null,
      username: '',
    });
  };

  return (
    <LoggedContext.Provider value={{ logged, setLogged, logoutLogged }}>
      {props.children}
    </LoggedContext.Provider>
  );
};

import { useState, useEffect, useContext, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { TokenContext } from './contexts/TokenContext';
import { SessionContext } from './contexts/SessionContext';
import { LoggedContext } from './contexts/LoggedContext';
import { getSession } from './api';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoadingApp from './Components/LoadingApp/LoadingApp';
import SessionUrl from './Components/SessionUrl/SessionUrl';
import TimerSnackbar from './Components/TimerSnackbar/TimerSnackbar';

function App() {
  const { token, setToken } = useContext(TokenContext);
  const { session, setSession } = useContext(SessionContext);
  const { logged, setLogged } = useContext(LoggedContext);
  const [loading, setLoading] = useState(false);
  const [showSessionUrl, setShowSessionUrl] = useState(false);
  const [snack, setSnack] = useState(false);

  const toggleShowSessionUrl = () => {
    setShowSessionUrl(!showSessionUrl);
  };

  // this side effect tries to get the session data if a token exists,
  // this is to re-login the user/host if he/she accidentally closed the window
  useEffect(() => {
    if (token !== null && token !== undefined && token !== '') {
      (async () => {
        setLoading(true);
        const data = await getSession(token);
        if (data) {
          // this extracts the data from inside the token
          const splitToken = token.split('.');
          const decodedToken = window.atob(splitToken[1]);
          const parsedData = JSON.parse(decodedToken);
          console.log(`🔐 Session ID: ${data.session._id}`);

          setSession(data.session);
          setLogged({ isLogged: true, role: parsedData.role, username: parsedData.username });
          setLoading(false);
        } else {
          setToken('');
          setSession({});
          setLogged({ isLogged: false, role: null });
          setLoading(false);
        }
      })();
    }

    // eslint-disable-next-line
  }, [token]);

  const RedirectAuthUser = () => {
    switch (logged.role) {
      case 'host':
        return <Redirect to='/host' />;
      case 'user':
        return <Redirect to='/user' />;
      default:
        return <Fragment />;
    }
  };

  return (
    <Fragment>
      {loading ? (
        <LoadingApp />
      ) : (
        <Router>
          <Navbar toggleShowSessionUrl={toggleShowSessionUrl} setSnack={setSnack} snack={snack} />
          {showSessionUrl && <SessionUrl id={session._id} toggleState={toggleShowSessionUrl} />}
          {snack && <TimerSnackbar snack={snack} setSnack={setSnack} />}

          <Switch>
            <Route exact path='/'>
              {/* 
              this is the landing page for host-create-session
              This needs a form with input field of "username"...
              Response from API will be:
              1. host token
            */}
              {logged.isLogged ? <RedirectAuthUser /> : <Home isHost={true} />}
            </Route>
            <Route exact path='/host'>
              {/* this is the host dashboard */}
              {logged.isLogged ? <Dashboard isHost={true} /> : <Redirect to='/' />}
            </Route>

            <Route exact path='/join/:id'>
              {/* 
              this is the page for user-join-session
              This needs a form with input field of "username"...
              Response from API will be:
              1. user token
            */}
              {logged.isLogged ? <RedirectAuthUser /> : <Home isHost={false} />}
            </Route>
            <Route exact path='/user'>
              {/* this is the user dashboard */}
              {logged.isLogged ? <Dashboard isHost={false} /> : <Redirect to='/' />}
            </Route>
          </Switch>
        </Router>
      )}
    </Fragment>
  );
}

export default App;

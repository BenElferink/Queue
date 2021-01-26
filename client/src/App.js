import { useState, useEffect, useContext, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { TokenContext } from './contexts/TokenContext';
import { SessionContext } from './contexts/SessionContext';
import { LoggedContext } from './contexts/LoggedContext';
import { getSession } from './api';
import Pusher from 'pusher-js';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoadingApp from './Components/LoadingApp/LoadingApp';

function App() {
  const { token, setToken } = useContext(TokenContext);
  const { session, setSession } = useContext(SessionContext);
  const { logged, setLogged } = useContext(LoggedContext);
  const [loading, setLoading] = useState(false);

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
          console.log(`🔐 Join session URL: http://localhost:3000/join/${data.session._id}`);

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

  // this side effect subscribes to the pusher channel, using the channel ID
  // subscription happens only if the session ID exists, meaning the session was fetched
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: 'ap2',
    });

    if (logged.isLogged) {
      const channel = pusher.subscribe(`session-${session._id}`);
      channel.bind('update-session', function (data) {
        setSession(data.session);
      });
    }

    return () => {
      pusher.unsubscribe();
      pusher.unbind_all();
    };
    // eslint-disable-next-line
  }, [logged, session]);

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
    <div id='home'>
      {loading ? (
        <LoadingApp />
      ) : (
        <Router>
          <Navbar />
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
    </div>
  );
}

export default App;

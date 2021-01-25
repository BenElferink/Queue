import { useEffect, useContext, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { TokenContext } from './contexts/TokenContext';
import { SessionContext } from './contexts/SessionContext';
import { LoggedContext } from './contexts/LoggedContext';
import { getSession } from './api';
import Pusher from 'pusher-js';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import UserDashboard from './Components/User/Dashboard/UserDashboard';

function App() {
  // Enable pusher logging - don't include this in production
  Pusher.logToConsole = true;

  const { token, setToken } = useContext(TokenContext);
  const { session, setSession } = useContext(SessionContext);
  const { logged, setLogged } = useContext(LoggedContext);

  // this side effect tries to get the session data if a token exists,
  // this is to re-login the user/host if he/she accidentally closed the window
  useEffect(() => {
    if (token !== null && token !== undefined && token !== '') {
      (async () => {
        const data = await getSession(token);
        if (data) {
          // this extracts the data from inside the token
          const splitToken = token.split('.');
          const decodedToken = window.atob(splitToken[1]);
          const parsedData = JSON.parse(decodedToken);

          setSession(data.session);
          setLogged({ isLogged: true, role: parsedData.role });
        } else {
          setToken('');
          setSession({});
          setLogged({ isLogged: false, role: null });
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
      // channel subscription
      const channel = pusher.subscribe(`session-${session._id}`);
      // event binding
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

  // ALL TOKENS WILL HAVE THE FOLLOWING DATA INSIDE:
  // 1) Session ID
  // 2) User ID
  // 3) Role: user/host

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
    <div className='app' id='home'>
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
            <UserDashboard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

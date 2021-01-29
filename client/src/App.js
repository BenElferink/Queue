import { useContext, useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction, refetchedRoom } from './app/actions';
import { SocketContext } from './app/SocketContext';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoadingApp from './Components/LoadingApp/LoadingApp';
import SessionUrl from './Components/SessionUrl/SessionUrl';
import TimerAlert from './Components/TimerAlert/TimerAlert';

export default function App() {
  const dispatch = useDispatch();
  const { roomId } = useSelector((state) => state.roomReducer);
  const { socket } = useContext(SocketContext);
  const { isLogged, token, role } = useSelector((state) => state.authReducer);
  const [loading, setLoading] = useState(false);

  // this side effect tries to get the session data if a token exists (and the user is not logged in),
  // this is to re-login the user/host if he/she accidentally closed the window
  useEffect(() => {
    const refetched = (data) => {
      dispatch(refetchedRoom({ roomId: data.roomId, queue: data.queue }));
      setLoading(false);
    };

    if (!isLogged && token) {
      setLoading(true);
      socket.emit(
        'refetch',
        { token },
        (error) =>
          error && console.log(error) + dispatch(logoutAction()) + window.location.reload(),
      );
      socket.on('refetched', refetched);
    }

    return () => {
      socket.off('refetched', refetched);
    };
    // eslint-disable-next-line
  }, [isLogged, token]);

  const RedirectAuthUser = () => {
    switch (role) {
      case 'host':
        return <Redirect to='/host' />;
      case 'user':
        return <Redirect to='/guest' />;
      default:
        return <Fragment />;
    }
  };

  const [showSessionUrl, setShowSessionUrl] = useState(false);
  const [showTimerAlert, setShowTimerAlert] = useState(false);

  return (
    <Fragment>
      {loading ? (
        <LoadingApp />
      ) : (
        <Router>
          <Navbar
            toggleShowSessionUrl={() => setShowSessionUrl(!showSessionUrl)}
            triggerAlert={() => setShowTimerAlert(true)}
          />
          {showSessionUrl && (
            <SessionUrl roomId={roomId} closeThis={() => setShowSessionUrl(false)} />
          )}
          {showTimerAlert && (
            <TimerAlert
              showTimerAlert={showTimerAlert}
              closeThis={() => setShowTimerAlert(false)}
            />
          )}

          <Switch>
            <Route exact path='/'>
              {/* 
              this is the landing page for host-create-session
              This needs a form with input field of "username"...
              Response from API will be:
              1. host token
            */}
              {isLogged ? <RedirectAuthUser /> : <Home isHost={true} />}
            </Route>
            <Route path='/host'>
              {/* this is the host dashboard */}
              {isLogged ? <Dashboard isHost={true} /> : <Redirect to='/' />}
            </Route>

            <Route path='/join/:id'>
              {/* 
              this is the page for user-join-session
              This needs a form with input field of "username"...
              Response from API will be:
              1. user token
            */}
              {isLogged ? <RedirectAuthUser /> : <Home isHost={false} />}
            </Route>
            <Route path='/guest'>
              {/* this is the user dashboard */}
              {isLogged ? <Dashboard isHost={false} /> : <Redirect to='/' />}
            </Route>
          </Switch>
        </Router>
      )}
    </Fragment>
  );
}

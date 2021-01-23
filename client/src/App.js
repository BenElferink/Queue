import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pusher from 'pusher-js';
import './styles/App.css';

function App() {
  const sessionId = null;

  // this needs tweaking once session ID is received from backend
  useEffect(() => {
    if (sessionId !== null) {
      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      // Pusher config
      const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: process.env.REACT_APP_CLUSTER,
      });

      // pusher channel (we need the session ID)
      const channel = pusher.subscribe(`session-${sessionId}`);

      // handle changes on session
      channel.bind('sync', function (data) {
        alert(JSON.stringify(data));
      });

      // handle delete of session
      channel.bind('delete', function (data) {
        alert(JSON.stringify(data));
      });

      return () => {
        pusher.unsubscribe();
        pusher.unbind_all();
      };
    }
  }, []);

  // ALL TOKENS WILL HAVE THE FOLLOWING DATA INSIDE:
  // 1) Session ID
  // 2) User ID
  // 3) Role: user/host

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/'>
            {/* 
              this is the landing page for host-create-session
              This needs a form with input field of "username"...
              Response from API will be:
              1. host token
              2. first-time-session-data
            */}
          </Route>
          <Route exact path='/session/:id'>
            {/* 
              this is the page for user-join-session
              This needs a form with input field of "username"...
              Response from API will be:
              1. user token
              2. first-time-session-data
            */}
          </Route>
          <Route exact path='/session/:id/host'>
            {/* this is the host dashboard */}
          </Route>
          <Route exact path='/session/:id/user'>
            {/* this is the user dashboard */}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

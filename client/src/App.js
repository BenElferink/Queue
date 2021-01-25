import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pusher from 'pusher-js';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';

function App() {
  // Enable pusher logging - don't include this in production
  Pusher.logToConsole = true;

  const [session, setSession] = useState({});

  // useEffect(() => {
  //   // pusher config
  //   const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  //     cluster: process.env.REACT_APP_CLUSTER,
  //   });

  //   // channel subscription
  //   const channel = pusher.subscribe(`session-${session._id}`);

  //   // event binding
  //   channel.bind('update-session', function (data) {
  //     setSession(data);
  //   });

  //   // cleanup
  //   return () => {
  //     pusher.unsubscribe();
  //     pusher.unbind_all();
  //   };
  // }, [session]);

  // ALL TOKENS WILL HAVE THE FOLLOWING DATA INSIDE:
  // 1) Session ID
  // 2) User ID
  // 3) Role: user/host

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
              2. first-time-session-data
            */}
            <Home />
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

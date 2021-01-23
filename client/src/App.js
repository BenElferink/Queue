import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/App.css';

// ALL TOKENS WILL HAVE THE FOLLOWING DATA INSIDE:
// 1) Session ID
// 2) User ID
// 3) Role: user/host

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/'>
            {/* this is the landing page for host-create-session */}
            {/* 
              This needs a form with input field of "username"...
              Response from API will be:
              1. host token
              2. session data
            */}
          </Route>
          <Route exact path='/host/:id'>
            {/* this is the host dashboard */}
            {/* need to config pusher for real-time */}
          </Route>
          <Route exact path='/session/:id/join'>
            {/* this is the page for user-join-session */}
            {/* 
              This needs a form with input field of "username"...
              Response from API will be:
              1. user token
              2. session data
            */}
          </Route>
          <Route exact path='/session/:id'>
            {/* this is the user dashboard */}
            {/* need to config pusher for real-time */}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

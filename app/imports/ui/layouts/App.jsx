import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';
import Lookup from '../pages/Lookup';
import Documentation from '../pages/Documentation';
import ReverseLookUp from '../pages/ReverseLookUp';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Landing}/>
            <Route exact path="/lookup" component={Lookup}/>
            <Route exact path="/lookup-list" component={ReverseLookUp}/>
            <Route exact path="/docs" component={Documentation}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

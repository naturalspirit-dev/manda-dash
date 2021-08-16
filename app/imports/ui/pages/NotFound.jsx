import React from 'react';
import { Header } from 'semantic-ui-react';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class NotFound extends React.Component {
  render() {
    return (
      <div className="not-found-text">
        <div className="not-found-text-div"><h1>⚠️404 Error⚠️</h1></div>
        <div className="not-found-text-div"><p>This page does not exist!</p></div>
        <div className="not-found-text-div"><a className="goback-text" href="/#">← Go back home</a></div>
      </div>
    );
  }
}

export default NotFound;

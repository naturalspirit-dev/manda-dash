import React from 'react';
import "semantic-ui-css/semantic.min.css"; //required for className
import '../../../client/style.css';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Grid, Button, Progress } from 'semantic-ui-react';
import Lookup from './Lookup';
import ReverseLookUp from './ReverseLookUp';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';

/** Renders the landing page. */
class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lookup: true,
      lookupList: true,
      lookupColor: "black",
      lookupListColor: "black",
      lookupSel: false,
      lookupListSel: false
    }
  }

  //logic for rendering lookup by location
  lookupInterface = () => {
    this.setState({
      lookup: true,
      lookupList: false,
      lookupColor: "blue",
      lookupListColor: "black",
      lookupSel: true,
      lookupListSel: false
    }); }

  //logic for rendering lookup by country
  reverseInterface = () => {
    this.setState({
      lookup: false,
      lookupList: true,
      lookupColor: "black",
      lookupListColor: "blue",
      lookupSel: false,
      lookupListSel: true
    });}

  render() {
    let ui = "";
    if (this.state.lookupSel) { ui = <Lookup key="lookup"/>; }
    if (this.state.lookupListSel) { ui = <ReverseLookUp key="reverse"/>; }
    return (
      <Grid id='landing-page' verticalAlign='middle' textAlign='center'>
        <Grid.Column className="landing-title">
          <h1>Pacific Maritime & Aviation Logistics Dashboard</h1>
          <p>For operational logisticians, a detailed understanding of port and airfield capabilities is needed at all times to estimate the
             viability of deployment plans and route options. This open source app brings crucial, hard to find data to the browser for one click access with the
             goal of <u>enabling quicker descions</u> and <u>improving agility</u> for the user and their team.</p>
          <p>This application utilizes a Python web scraper to gather the latest open source data on ports and airfields around the Indo-Pacific theatre.</p>
          <div id="button-or" className="button-wrapper">
            <Button.Group>
              <Button content="Search by Location" color={this.state.lookupColor} size="huge" onClick={this.lookupInterface}></Button>
                <Button.Or />
              <Button content="Search by Country " color={this.state.lookupListColor} size="huge" onClick={this.reverseInterface}></Button>
            </Button.Group>
          </div>
          <Grid.Row>
            {ui}
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default (Landing);

import React from 'react';
import { Grid, Button, Dropdown, Container, Loader } from 'semantic-ui-react';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import {replaceCountryCode, replaceCountryName} from '../../utils/replaceCountryCode.js';
import capitalizeWords from '../../utils/stringFormatting.js';
import ReverseDropdownList from '../components/ReverseDropdownList';
import DataList from '../components/DataList';

/* Renders dropdowns and selected DataCard for lookup by country function */
class ReverseLookUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchRequest: false,
      result: {}
    }
  }

  handleResult = (result) => {
    if(result.location === "Port or Airfield" || result.country === "Country") {
      return window.alert("Please fill out all fields")
    }
    result.country = replaceCountryName(result.country);
    this.setState({ searchRequest: true, result: result });
  }

  render() {
    return (this.props.ready2) ? this.renderPage() :
        <Grid.Row>
            <Loader style={{ marginTop: "300px" }} size="big" active inverted>Loading Data...</Loader>
        </Grid.Row>
  }

  renderPage() {
    let dataList;
    this.state.searchRequest ? dataList = <DataList location={this.state.result} key={this.state.result.country} /> : null;
    return(
      <div>
        <Container className="lookup-container">
          <ReverseDropdownList className="lookup-dropdown-list" handleResult={this.handleResult} />
          {dataList}
        </Container>
      </div>
    );
  }

}

export default withTracker((props) => {
  // Get access to Data
  const subscription = Meteor.subscribe('PortsCollection');
  const subscription2 = Meteor.subscribe('AirfieldsCollection');
  const ready = subscription.ready();
  const ready2 = subscription2.ready();
  // Get the Data
  const ports = Ports.collection.find({}).fetch();
  const airfields = Airfields.collection.find({}).fetch();
  return {
    ready,
    ready2,
    ports,
    airfields,
  };
})(ReverseLookUp);

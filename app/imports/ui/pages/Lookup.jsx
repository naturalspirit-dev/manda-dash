import React from 'react';
import { Grid, Button, Dropdown, Icon, Container, Loader } from 'semantic-ui-react';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import ReverseLookUp from './ReverseLookUp';
import PortDataCard from '../components/PortDataCard';
import ColumnDescriptions from '../../api/ports/columndescriptions.json';
import AirfieldDataCard from '../components/AirfieldDataCard';
import LookupDropdownList from '../components/LookupDropdownList'
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import replaceCountryCode from '../../utils/replaceCountryCode.js';
import capitalizeWords from '../../utils/stringFormatting.js';
import { PortsDescriptions } from '../../api/ports/portdescriptions.json';

/* Renders dropdowns and selected DataCard for lookup by location function */
class Lookup extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      searchRequest: false,
      result: {},
      descriptions: [],
      type: "",
    };
  }

  componentDidMount() {
    this.setDescriptions();
  }

  setDescriptions = () => {
    let array = ColumnDescriptions.ColumnDescriptions.filter(item =>
      this.state.descriptions.push({ name: item.name, description: item.description }));
  }

  handleResult = (result) => {
    let found = "";
    if(result.location === "Port") {
      found =  Ports.collection.find({portName: result.name.toUpperCase()}).fetch();
    } else if (result.location === "Airfield") {
      found = Airfields.collection.find({airFieldName: result.name}).fetch();
    }
    this.setState({ type: result.location, searchRequest: true, result: found[0] });
  }

  getDataCard = () => {
    if (this.state.value === "Port or Airfield" ||
        this.state.result.country === "Country" ||
        this.state.result.name === "Port Name" ||
        this.state.result.name === "Airfield Name") {
      return window.alert("Please fill out all fields");
    } else if(this.state.type === "Port") {
      return <PortDataCard port={this.state.result} descriptions={this.state.descriptions} key={this.state.result.portName} />
    } else if (this.state.type === "Airfield") {
      return <AirfieldDataCard airfield={this.state.result} descriptions={this.state.descriptions} key={this.state.result.airFieldName} />
    } else {
      return null;
    }
  }

  render() {
    return (this.props.ready2) ? this.renderPage() :
        <Grid.Row>
            <Loader style={{ marginTop: "300px" }} size="big" active inverted>Loading Data...</Loader>
        </Grid.Row>
  }

  renderPage() {
    let dataCard;
    this.state.searchRequest ? dataCard = this.getDataCard() : null;
    return (
      <Container className="lookup-container">
        <LookupDropdownList className="lookup-dropdown-list" handleResult={this.handleResult}/>
        {dataCard}
      </Container>
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
})(Lookup);

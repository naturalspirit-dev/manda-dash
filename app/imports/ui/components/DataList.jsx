import React from 'react';
import { Grid, Tab, Loader, Pagination, Container, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import PortDataCard from './PortDataCard';
import AirfieldDataCard from './AirfieldDataCard';
import ColumnDescriptions from '../../api/ports/columndescriptions.json';
import PortsDescriptions from '../../api/ports/portdescriptions.json';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import capitalizeWords from '../../utils/stringFormatting.js';
import {replaceCountryCode, replaceCountryName} from '../../utils/replaceCountryCode.js';

/* Renders a tabular list of countrys with corresponding DataCards */
class DataList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabPanes: [],
      descriptions: [],
      objs: [],
      length: 0
    }
  }

  componentDidMount() {
    let n = 0;
    this.setDescriptions();
    if(this.props.location.location === "Port") {
      let arr = Ports.collection.find({ country: this.props.location.country }).fetch();
      while(arr.length) {
        this.state.objs.push({ [n]: arr.splice(0,30) });
        n++;
      }
      this.setState({ length: Ports.collection.find({ country: this.props.location.country }).fetch().length });
    } else if (this.props.location.location === "Airfield") {
      let arr = Airfields.collection.find({ country: this.props.location.country }).fetch();
      while(arr.length) {
        this.state.objs.push({ [n]: arr.splice(0,30) });
        n++;
      }
      this.setState({ length: Airfields.collection.find({ country: this.props.location.country }).fetch().length })
    }
    this.validNames(this.props.location.location, this.props.location.country, 0);
  }

  setDescriptions = () => {
    let array = ColumnDescriptions.ColumnDescriptions.filter(item =>
      this.state.descriptions.push({ name: item.name, description: item.description }));
  }

  //sets tabPanes based on selected country
  validNames = (type, country, curr) => {
    let n = 0;  // port iterator
    let j = 0; // airfield itator
    let checked = [];
    let newTabPanes = [];
    if(curr > 0) { curr--; } //indexify
    let currentArray = this.state.objs[curr][curr];
    this.setState({ tabPanes: [] });
    if(type === "Port") {
      currentArray.map(port => {
        if(port.country === country && !checked.includes(port.portName)) {
          newTabPanes.push({
            menuItem: capitalizeWords(port.portName),
            render: () => <Tab.Pane active className="tab-listpane"><PortDataCard islist="true" port={port} descriptions={this.state.descriptions} key={n}/></Tab.Pane>,
            key: n
          });
          checked.push(port.portName);
        }
        n++;
      });
    } else if (type === "Airfield") {
      currentArray.map(airfield => {
        if(airfield.country === country && !checked.includes(airfield.airFieldName)) {
          newTabPanes.push({
            menuItem: airfield.airFieldName,
            render: () => <Tab.Pane className="tab-listpane"><AirfieldDataCard islist="true" airfield={airfield} descriptions={this.state.descriptions} key={j}/></Tab.Pane>,
            key: j
          });
          checked.push(airfield.airFieldName);
        }
        j++;
      });
    }
    this.setState({ tabPanes: newTabPanes });
  }

  handleInputChange = (e, {activePage}) => {
    this.validNames(this.props.location.location, this.props.location.country, activePage);
  }

  renderPaginator = () => {
    return (
      <Pagination
        className="list-paginator"
        boundaryRange={0}
        defaultActivePage={1}
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={10}
        totalPages={this.state.objs.length}
        onPageChange={this.handleInputChange}
      />
    );
  }

  render() {
    return this.state.tabPanes.length === 0 ? <Loader active inverted inline='centered'>Loading data...</Loader> : this.renderComponent();
  }

  renderComponent() {
    let paginator = "";
    this.state.length > 30 ? paginator = this.renderPaginator() : paginator = <div></div>;
    return (
      <Container className="tab-list-container">
        <div>
        {paginator}
          <Tab
            className="tab-list"
            panes={this.state.tabPanes}
            menu={{
              fluid: true,
              vertical: true,
              tabular: true,
              pointing: true,
              attached: true,
              pagination: true
            }}
            renderActiveOnly={true}
            menuPosition="left"
            grid={{ paneWidth: 10, tabWidth: 3 }}
          />
        </div>
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
})(DataList);

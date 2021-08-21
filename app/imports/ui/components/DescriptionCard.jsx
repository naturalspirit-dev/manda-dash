import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import capitalizeWords from '../../utils/stringFormatting.js';
import PortsDescriptions from '../../api/ports/portdescriptions.json';

/* Renders a Card with the descripition associated with a DataCard */
class DescriptionCard extends React.Component {

  setDescription = () => {
    let array = PortsDescriptions.PortsDescriptions.filter(port => port.name === capitalizeWords(this.props.name));
    if (!array.length <= 0) {
      return(
        <Card color="blue" className="card">
          <Card.Content className="card-content">
            <Card.Header>First Hand Description</Card.Header>
            <Card.Meta>Pulled from the World Port Index</Card.Meta>
            <Card.Description className="card-description">{array[0].description}</Card.Description>
          </Card.Content>
        </Card>);
    } else {
      return "";
    }
  }

  render() {
    return(<div>{this.setDescription()}</div>);
  }
}

export default(DescriptionCard);

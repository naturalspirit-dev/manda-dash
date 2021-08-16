import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import capitalizeWords from '../../utils/stringFormatting.js';

/* Renders C-130 and Rail Access viability for a location */
class C130Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      render: ""
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let airfield = "";
    let rail = "";
    if(prevProps !== this.props) {
      if(this.props.type === "Airfield") {
        let location = Airfields.collection.find({airFieldName: this.props.location.airFieldName}).fetch();
        this.renderAirfield(location[0]);
      } else {
          let location = Ports.collection.find({portName: this.props.location.portName.toUpperCase()}).fetch();
          airfield = location[0].closestCOneThirtyCSeventeen;
          rail = location[0].rail;
          if(airfield !== undefined && rail !== "Yes") {
            this.renderc130(airfield, rail);
          } else if(airfield === undefined && rail === "Yes") {
            this.renderRail(airfield, rail);
          } else if(airfield !== undefined && rail === "Yes") {
            this.renderBoth(airfield, rail);
          }
        }
    }
  }

  componentDidMount() {
    let airfield = "";
    let rail = "";
    if(this.props.type === "Airfield") {
      let location = Airfields.collection.find({airFieldName: this.props.location.airFieldName}).fetch();
      this.renderAirfield(location[0]);
    } else {
        let location = Ports.collection.find({portName: this.props.location.portName.toUpperCase()}).fetch();
        airfield = location[0].closestCOneThirtyCSeventeen;
        rail = location[0].rail;
        if(airfield !== undefined && rail !== "Yes") {
          this.renderc130(airfield, rail);
        } else if(airfield === undefined && rail === "Yes") {
          this.renderRail(airfield, rail);
        } else if(airfield !== undefined && rail === "Yes") {
          this.renderBoth(airfield, rail);
        }
      }
  }

  renderAirfield(airfield) {
    if(airfield.capableCOneThirtyCSeventeen === "Yes") {
      this.setState({ render:
        (<Card color="blue" className="card">
          <Card.Content className="card-content">
            <Card.Header>Access</Card.Header>
            <Card.Description className="card-description">
              <Icon name="check" color="green"/>{airfield.airFieldName}<strong> is</strong> a C130/C-17 Capable Airfield
            </Card.Description>
          </Card.Content>
        </Card>)
      });
    } else if (airfield.capableCOneThirtyCSeventeen === "No") {
      this.setState({ render:
        (<Card color="blue" className="card">
          <Card.Content className="card-content">
            <Card.Header>Access</Card.Header>
            <Card.Description className="card-description">
              <Icon name="close" color="red"/>{airfield.airFieldName}<strong> is not</strong> C130/C-17 Capable
            </Card.Description>
          </Card.Content>
        </Card>)
      });
    }
  }

  renderBoth(airfield, rail) {
    this.setState({ render:
      (<Card color="blue" className="card">
        <Card.Content className="card-content">
          <Card.Header>Access</Card.Header>
          <Card.Description className="card-description">
            Closest C130/C-17 Capable Airfield: {airfield}
          </Card.Description>
          <Card.Description className="card-description">
            <Icon name="check" color="green"/> This location has rail access
          </Card.Description>
        </Card.Content>
      </Card>)
    });
  }

  renderc130(airfield, rail) {
    this.setState({ render:
      (<Card color="blue" className="card">
        <Card.Content className="card-content">
          <Card.Header>Access</Card.Header>
          <Card.Description className="card-description">
            Closest C130/C-17 Capable Airfield: {airfield}
          </Card.Description>
        </Card.Content>
      </Card>)
    });
  }

  renderRail(airfield, rail) {
    if(rail === "Yes") {
         this.setState({ render:
           (<Card color="blue" className="card">
             <Card.Content className="card-content">
               <Card.Header>Access</Card.Header>
                <Card.Description className="card-description">
                  <Icon name="check" color="green"/> This location has rail access
                </Card.Description>
              </Card.Content>
            </Card>)
          });
       } else if (rail === "No") {
         this.setState({ render:
           (<Card color="blue" className="card">
             <Card.Content className="card-content">
               <Card.Header>Access</Card.Header>
                <Card.Description className="card-description">
                  <Icon name="close" color="red"/> This location does not have rail access
                </Card.Description>
              </Card.Content>
            </Card>)
          });
       }
  }

  render() {
    return(<div>{this.state.render}</div>);
  }

}
export default withTracker((props) => {
  const subscription = Meteor.subscribe('PortsCollection');
  const subscription2 = Meteor.subscribe('AirfieldsCollection');
  const ports = Ports.collection.find({}).fetch();
  const airfields = Airfields.collection.find({}).fetch();
  return {
    ports,
    airfields,
  };
})(C130Card);

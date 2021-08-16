import React from 'react';
import { Card, Icon, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/* Render a Google Map API card for the associated DataCard */
class MapCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { src: "" }
  }

  async componentDidUpdate(prevProps, prevState) {
    if(prevProps !== this.props) {
      this.setState({ src: await this.buildSrc() })
    }
  }

  buildSrc = async () => {
    try {
      let newName = this.props.name.replaceAll(" ", "+");
      return new Promise((resolve, reject) => {
        Meteor.call("buildSrc", newName, this.props.type, this.props.country, function(error, result) {
          resolve(result);
        });
      });
    } catch(err) { console.error(err); }
  }

  async componentDidMount() {
    this.setState({ src: await this.buildSrc() })
  }

  render(){
    if(this.state.src === "") {
      return (<Card color="blue" className="card">
        <Card.Content className="card-content">
          <Card.Header>Satellite Image</Card.Header>
          <Card.Meta style={{paddingBottom: "4px"}}>Google Maps Satellite</Card.Meta>
          <Loader active inline='centered'>Fetching Map...</Loader>
        </Card.Content>
      </Card>);
    } else {
      return this.renderComponent();
    }
  }

  renderComponent() {
    return(
      <Card color="blue" className="card">
        <Card.Content className="card-content">
          <Card.Header>Satellite Image</Card.Header>
          <Card.Meta style={{paddingBottom: "4px"}}>Google Maps Satellite</Card.Meta>
          <div className="image-component">
            <iframe
              id="iframe"
              runat="server"
              src={this.state.src}
              width="260"
              height="450"
              style= {{ border: "0" }}
              allowFullScreen=""
              loading="lazy">
            </iframe>
          </div>
          <Card.Meta className="maps-meta">
            <a href='#/docs'><i>Is the map displaying unexpected results?</i></a>
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

export default(MapCard);

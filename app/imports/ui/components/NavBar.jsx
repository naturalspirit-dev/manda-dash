import React from 'react';
import { withRouter, NavLink, Redirect } from 'react-router-dom';
import { Menu, Button, Icon, Header, Modal, Link, Label } from 'semantic-ui-react';
import DataController from './DataController';
import Timer from './Timer';
import {day, time} from '../../api/changes/lastscrape.json';

/* The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          loadData: false,
          open: false,
          content: "Scrape Latest Data"
      };
  }

  getData = () => {
    this.setState({ loadData: true, open: false, content: <Timer callback={this.funcDidUpdate}/> });
  }

  setOpen = () => {
    this.setState((currentState) => {
     return ({ open: !currentState.open });
    });
  }

  changePercent = (percent) => {
    if(percent >= 100) {
      this.setState({ content: "Scrape Latest Data", loadData: false });
    }
  }

  render() {
    let controller = "";
    this.state.loadData ? controller = <DataController /> : controller = null;
    return (
      <div className="menu-glow">
      <Menu className="menu-style" attached="top" borderless inverted>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <h1>M<span>&</span>A Dashboard</h1>
        </Menu.Item>
        <Menu.Item as={NavLink} activeClassName="" exact to="/docs">
          <h4>FAQ</h4>
        </Menu.Item>
        <Menu.Item>
          <a className="nav-icon" href="https://github.com/josephpalma/manda-dash" target="_blank">
            <Icon className="icon-glow" name="github"/>
          </a>
        </Menu.Item>
        <Menu.Item position="right">
          <Modal
            centered
            basic
            onClose={this.setOpen}
            onOpen={this.setOpen}
            open={this.state.open}
            trigger={<Button color="blue" content={this.state.content} disabled={this.state.loadData} />}>
            <Header icon>
              <Icon name='warning sign' />
                Warning
            </Header>
            <Modal.Content className="warning-modal">
              <p>This could take up to 6 hours to complete. Do you still wish to continue?
              <span onClick={this.setOpen}><a href='#/docs'> Why?</a></span></p>
            </Modal.Content>
            <Modal.Actions className="warning-modal">
              <Button color='red' inverted onClick={this.setOpen}>
                <Icon name='remove' /> No
              </Button>
              <Button color='blue' inverted onClick={this.getData}>
                <Icon name='checkmark' /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
        </Menu.Item>
        <Menu.Item >
          <div><p>Data last updated {day}</p></div>
        </Menu.Item>
        {controller}
      </Menu>
      </div>
    );
  }
}

// Enable ReactRouter for this component.
export default withRouter(NavBar);

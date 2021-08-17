import React from 'react';
import '../../../client/style.css';
import { Link, withRouter } from 'react-router-dom';
import { Accordion, Icon, Grid, Image } from 'semantic-ui-react';

/* A simple component to render user documentation. */
class Documentation extends React.Component {

  constructor(props) {
    super(props);
    this.state = { activeIndex: null }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state
        return (
          <Grid verticalAlign='middle' container className="docs-grid">
            <Grid.Column computer='sixteen'>
              <h1 className="docs-header">FAQ</h1>
              <Accordion fluid styled exclusive={false}>
                <Accordion.Title className="docs-title" active={activeIndex === 0} index={0} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Who is this app for?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 0}>
                  <p id="who">This app was designed for operational logisticians to assist in planning sea or air routes. All around the pacific are ports and airfields of varying capabilities. This program is supposed to assist in determining the restrictions of various locations in a searchable dashboard format.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 1} index={1} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  How do I use it?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 1}>
                  <p>Check out our <a target="_blank" href={`https://www.youtube.com/watch?v=Hib1jKbl0w8`}>video</a>.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 2} index={2} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Webmaster contact information
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 2}>
                  <p>Emily Pang (MARFORPAC):
                    <ul><li>emily.pang@usmc.mil</li></ul>
                  </p>
                  <p>Joseph Palma (X-Force):
                    <ul><li>joepalma08@hotmail.com</li></ul>
                  </p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 3} index={3} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Background information on this project
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 3}>
                  <p>Operational Logisiticians often have a problem efficiently gathering data from open sources. Sometimes,
                     route estimates can take three planners up to four days to develop per key terrain location. Because of
                     this valuable time is often lost. </p>
                  <p>In comes the X-Force team, hired by NSIN, and contracted by MARFORPAC to implement an open source
                     solution that brings crucial, hard to find data to the browser. with the goal of enabling quicker
                     descions and improving agility for the user and their team.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 4} index={4} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  How to contribute to this project?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 4}>
                <p>If you are a Javascript or Python developer, consider looking at our open issues on
                   <a href="https://github.com/josephpalma/manda-dashboard">github.</a></p>
                <p>We are always looking for contributions to the dataset, for more information on how to add to the database, check out the README.</p>
                </Accordion.Content>
              </Accordion>

              <Accordion style={{ marginTop: "35px" }} fluid styled exclusive={false}>
                <Accordion.Title className="docs-title" active={activeIndex === 5} index={5} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  How often should you scrape the latest data?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 5}>
                  <p>We recommend the bot be run once every month. Much of the data presented is static and unlikely to change over short periods of time.</p>
                  <p>This app comes loaded with all the data needed to use it. The initial data set was collected in August, 2021. You can see the data and
                     time of the last scrape in the top right of the menu bar.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 6} index={6} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Why does the scraper bot take so long?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 6}>
                  <p id="scrapertime">Websites occasionally have preventions against large scale scraping. To subvert these mechanisms, we have included automated rest intervals in between our code.</p>
                  <p>The time intervals are a function of returned response values and can vary, but usually expect a 4 - 6 hour wait for a complete run.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 7} index={7} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Why is the list of countrys/names so short?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 7}>
                  <p>There is a lot of data, if it doesnt load correctly please wait a few seconds and try again.</p>
                  <p>If the problem persists, please contact the webmaster.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 8} index={8} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Where can I find the error log?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 8}>
                  <p>Errors from the scraper bot are written to /scraper/data. All other errors are written to the client or server console.</p>
                </Accordion.Content>
                <Accordion.Title className="docs-title" active={activeIndex === 9} index={9} onClick={this.handleClick}>
                  <Icon name='dropdown' />
                  Why is the Google Maps Satellite view displaying unexpected results?
                </Accordion.Title>
                <Accordion.Content className="docs-text" active={activeIndex === 9}>
                  <p>The map card searches for the port or airfield by name, and sometimes the records Google has associated with them return unexpected results, like the port authority's address, or the citys
                     center, or anything else Google Maps may return to it.</p>
                  <p>The best way to use the map card is to zoom in or out using ctrl + scroll to find the location in question. You can also click 'View Larger Map' to open the full screen Google Map in a new tab.</p>
                </Accordion.Content>
              </Accordion>
              </Grid.Column>
            </Grid>
        );
    }

}

export default Documentation;

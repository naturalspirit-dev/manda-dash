import React from 'react';
import { Table, Container, Card, Icon, Grid, Image, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import DescriptionCard from './DescriptionCard';
import C130Card from './C130Card';
import MapCard from './MapCard';
import capitalizeWords from '../../utils/stringFormatting.js';
import {replaceCountryCode, replaceCountryName} from '../../utils/replaceCountryCode.js';

/* Renders the data card for an Airfield Object */
class AirfieldDataCard extends React.Component {

  constructor(props) { super(props); }

  getLink = () => {
    return (<a href={`https://google.com/search?q=${this.props.airfield.airFieldName}+${replaceCountryCode(this.props.airfield.country)}`} target="_blank">Find Airfield Website</a>);
  }

  getWeather = () => {
    return (<a href={this.props.airfield.weatherLink} target="_blank">Current Weather</a>);
  }

  render() {
    let style = "none"
    this.props.islist ? style = "data-card-grid" : null;
    return (
      <div>
        <Grid className={style} centered container columns={2}>
        <div className="card-left">
          <Grid.Row className="card-grid-row">
            <Card color="blue">
              <Card.Content className="card-content">
                <Card.Header>{this.props.airfield.airFieldName}</Card.Header>
                <Card.Meta>{replaceCountryCode(this.props.airfield.country)}</Card.Meta>
                {this.props.airfield.airportUse ? <Card.Description style={{paddingBottom: "3px"}}>Open for {this.props.airfield.airportUse} Use</Card.Description> : ""}
                {this.props.airfield.weatherLink ? <Card.Description style={{paddingBottom: "3px", paddingLeft: "6px"}}><Icon name='cloud'/>{this.getWeather()}</Card.Description> : ""}
                <Card.Description className="card-description"><Icon name='globe'/>{this.getLink()}</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Row>

          <Grid.Row className="card-grid-row">
            <C130Card location={this.props.airfield} type="Airfield" />
          </Grid.Row>

          <Grid.Row className="card-grid-row">
            <MapCard name={this.props.airfield.airFieldName} type="Airfield" country={replaceCountryCode(this.props.airfield.country)} />
          </Grid.Row>

        </div>
          <Grid.Column stretched>
            <div>
              <Table className="stats-table" compact celled striped size={"small"}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="card-header-row" colSpan='3'>General Information</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.rendericao()}
                  {this.renderLat()}
                  {this.renderLong()}
                  {this.renderddLong()}
                  {this.renderddLat()}
                </Table.Body>
                  <Table.Header>
                    {this.renderHeader()}
                  </Table.Header>
                  <Table.Body>
                    {this.renderRunwayOneDimensions()}
                    {this.renderRunwayOneSurface()}
                    {this.renderRunwayTwoDimensions()}
                    {this.renderRunwayTwoSurface()}
                    {this.renderRunwayThreeDimensions()}
                    {this.renderRunwayThreeSurface()}
                    {this.renderRunwayFourDimensions()}
                    {this.renderRunwayFourSurface()}
                  </Table.Body>
              </Table>
            </div>
          </Grid.Column>
        </Grid>
      </div>

    );
  }

/* Conditionally render all fields */
  renderHeader = () => {
    if(this.props.airfield.runwayOneDimensions ||
      this.props.airfield.runwayOneSurface ||
      this.props.airfield.runwayTwoDimensions ||
      this.props.airfield.runwayTwoSurface ||
      this.props.airfield.runwayThreeDimensions ||
      this.props.airfield.runwayThreeSurface ||
      this.props.airfield.runwayFourSurface ||
      this.props.airfield.runwayFourDimensions) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Airstrip Dimensions</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  rendericao = () => {
    if(this.props.airfield.icaoCodes) { return <Table.Row>
        <Table.Cell>ICAO</Table.Cell>
        <Table.Cell>{this.props.airfield.icaoCodes}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderLat = () => {
    if(this.props.airfield.latitude) { return <Table.Row>
        <Table.Cell>Latitude</Table.Cell>
        <Table.Cell>{this.props.airfield.latitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderLong = () => {
    if(this.props.airfield.longitude) { return <Table.Row>
        <Table.Cell>Longitude</Table.Cell>
        <Table.Cell>{this.props.airfield.longitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderddLong = () =>  {
    if(this.props.airfield.ddLongitude) {
      let array = this.props.descriptions.filter(item => item.name === "Decimal Degree Coordinates" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>DD Longitude</Table.Cell>
            <Table.Cell>{this.props.airfield.ddLongitude}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>DD Longitude</Table.Cell>
        <Table.Cell>{this.props.airfield.ddLongitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderddLat = () =>  {
    if(this.props.airfield.ddLatitude) {
      let array = this.props.descriptions.filter(item => item.name === "Decimal Degree Coordinates" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>DD Latitude</Table.Cell>
            <Table.Cell>{this.props.airfield.ddLatitude}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>DD Latitude</Table.Cell>
        <Table.Cell>{this.props.airfield.ddLatitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayOneDimensions = () => {
    if(this.props.airfield.runwayOneDimensions) { return <Table.Row>
        <Table.Cell>Runway One Dimensions</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayOneDimensions}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayOneSurface = () => {
    if(this.props.airfield.runwayOneSurface) { return <Table.Row>
        <Table.Cell>Runway One Surface</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayOneSurface}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayTwoDimensions = () => {
    if(this.props.airfield.runwayTwoDimensions) { return <Table.Row>
        <Table.Cell>Runway Two Dimensions</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayTwoDimensions}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayTwoSurface = () => {
    if(this.props.airfield.runwayTwoSurface) { return <Table.Row>
        <Table.Cell>Runway Two Surface</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayTwoSurface}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayThreeDimensions = () => {
    if(this.props.airfield.runwayThreeDimensions) { return <Table.Row>
        <Table.Cell>Runway Three Dimensions</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayThreeDimensions}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayThreeSurface = () => {
    if(this.props.airfield.runwayThreeSurface) { return <Table.Row>
        <Table.Cell>Runway Three Surface</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayThreeSurface}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayFourDimensions = () => {
    if(this.props.airfield.runwayFourDimensions) { return <Table.Row>
        <Table.Cell>Runway Four Dimensions</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayFourDimensions}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRunwayFourSurface = () => {
    if(this.props.airfield.runwayFourSurface) { return <Table.Row>
        <Table.Cell>Runway Four Surface</Table.Cell>
        <Table.Cell>{this.props.airfield.runwayFourSurface}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

}

export default (AirfieldDataCard);

import React from 'react';
import { Table, Container, Card, Icon, Grid, Image, Loader, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import DescriptionCard from './DescriptionCard';
import C130Card from './C130Card';
import MapCard from './MapCard';
import PortsDescriptions from '../../api/ports/portdescriptions.json';
import capitalizeWords from '../../utils/stringFormatting.js';
import {replaceCountryCode, replaceCountryName} from '../../utils/replaceCountryCode.js';

/* Renders the data card for a Port Object */
class PortDataCard extends React.Component {

  constructor(props) { super(props); }

  getLink = () => {
    return (<a href={`https://google.com/search?q=${"Port+of"}+${capitalizeWords(this.props.port.portName)}+${replaceCountryCode(this.props.port.country)}`} target="_blank">Find Port Website</a>);
  }

  render() {
    let style = "none";
    this.props.islist ? style = "data-card-grid" : null;
    return (
      <div>
        <Grid className={style} stackable centered container columns={2}>
        <div className="card-left">
          <Grid.Row className="card-grid-row">
            <Card color="blue">
              <Card.Content className="card-content">
                <Card.Header>{capitalizeWords(this.props.port.portName)}</Card.Header>
                <Card.Meta>{replaceCountryCode(this.props.port.country)}</Card.Meta>
                {this.props.port.address ? <Card.Description style={{paddingBottom: "3px"}}>{this.props.port.address}</Card.Description> : ""}
                {this.props.port.phone ? <Card.Description className="card-description"><Icon name='phone'/>{this.props.port.phone}</Card.Description> : ""}
                {this.props.port.email ? <Card.Description className="card-description"><Icon name='mail'/>{this.props.port.email}</Card.Description> : ""}
                <Card.Description className="card-description"><Icon name='globe'/>{this.getLink()}</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Row>

          <Grid.Row className="card-grid-row">
            <C130Card location={this.props.port} type="Port" />
          </Grid.Row>

          <Grid.Row className="card-grid-row">
            <MapCard name={this.props.port.portName} type="Port" country={replaceCountryCode(this.props.port.country)} />
          </Grid.Row>

          <Grid.Row className="card-grid-row">
            <DescriptionCard name={this.props.port.portName}/>
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
                  {this.renderPortAuthority()}
                  {this.renderLat()}
                  {this.renderLong()}
                  {this.renderddLat()}
                  {this.renderddLong()}
                  {this.renderPortType()}
                  {this.renderFirstEntry()}
                  {this.renderPublication()}
                  {this.renderChart()}
                  {this.renderUsaRep()}
                  {this.renderMedicalFacs()}
                </Table.Body>
                  <Table.Header>
                    {this.renderHeader3()}
                  </Table.Header>
                <Table.Body>
                  {this.renderHarborSize()}
                  {this.renderShelter()}
                  {this.renderMaxVesselSize()}
                  {this.renderHarborType()}
                  {this.renderTurningArea()}
                  {this.renderHoldingGround()}
                </Table.Body>
                  <Table.Header>
                    {this.renderHeader4()}
                  </Table.Header>
                <Table.Body>
                  {this.renderTide()}
                  {this.renderOverheadLimit()}
                  {this.renderSwell()}
                  {this.renderPratique()}
                </Table.Body>
                    <Table.Header>
                      {this.renderHeader5()}
                    </Table.Header>
                  <Table.Body>
                    {this.renderChannel()}
                    {this.renderCargoPier()}
                    {this.renderMeanTide()}
                    {this.renderAnchorage()}
                    {this.renderOilTerminal()}
                  </Table.Body>
                    <Table.Header>
                      {this.renderHeader6()}
                    </Table.Header>
                  <Table.Body>
                    {this.renderCompulsory()}
                    {this.renderAvailable()}
                  </Table.Body>
                    <Table.Header>
                      {this.renderHeader7()}
                    </Table.Header>
                  <Table.Body>
                    {this.renderTugAssist()}
                    {this.renderTugSalvage()}
                  </Table.Body>
                    <Table.Header>
                      {this.renderHeader8()}
                    </Table.Header>
                  <Table.Body>
                    {this.renderWharves()}
                    {this.renderMedMoor()}
                    {this.renderHundredTonLifts()}
                    {this.renderFiftyTonLifts()}
                    {this.renderTwentyTonLifts()}
                    {this.renderZeroTonLifts()}
                    {this.renderFixedCranes()}
                    {this.renderMobileCranes()}
                    {this.renderFloatingCranes()}
                  </Table.Body>
                    <Table.Header>
                      {this.renderHeader9()}
                    </Table.Header>
                  <Table.Body>
                    {this.renderLongshore()}
                    {this.renderShipRepairs()}
                    {this.renderRail()}
                    {this.renderMarineRail()}
                    {this.renderDrydock()}
                  </Table.Body>
                    <Table.Header>
                      {this.renderHeader10()}
                    </Table.Header>
                  <Table.Body>
                    {this.renderProvisions()}
                    {this.renderFuel()}
                    {this.renderDeck()}
                    {this.renderWater()}
                    {this.renderDiesel()}
                  </Table.Body>
              </Table>
            </div>
          </Grid.Column>
        </Grid>
      </div>

    );
  }

/* Conditionally render all fields */
  renderHeader3 = () => {
    if(this.props.port.holdingGround ||
      this.props.port.turningArea ||
      this.props.port.harborType ||
      this.props.port.maxVesselSize ||
      this.props.port.shelter ||
      this.props.port.harborSize) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Harbor Characteristics</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader4 = () => {
    if(this.props.port.tide ||
      this.props.port.overheadLimit ||
      this.props.port.swell ||
      this.props.port.pratique) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Entrance Restrictions</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader5 = () => {
    if(this.props.port.channel ||
      this.props.port.cargoPier ||
      this.props.port.meanTide ||
      this.props.port.anchorage ||
      this.props.oilTerminal) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Water Depth</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader6 = () => {
    if(this.props.port.compulsory ||
      this.props.port.available) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Pilotage</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader7 = () => {
    if(this.props.port.tugSalvage ||
      this.props.port.tugAssistance) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Tugs</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader8 = () => {
    if(this.props.port.wharves ||
      this.props.port.medMoor ||
      this.props.port.hundredTonLifts ||
      this.props.port.fiftyTonLifts ||
      this.props.port.twentyTonLifts ||
      this.props.port.zeroTonLifts ||
      this.props.port.fixedCranes ||
      this.props.port.mobileCranes ||
      this.props.port.floatingCranes) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Loading & Unloading</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader9 = () => {
    if(this.props.port.longshore ||
      this.props.port.shipRepairs ||
      this.props.port.rail ||
      this.props.port.marineRailroadSize) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Port Services</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderHeader10 = () => {
    if(this.props.port.provisions ||
      this.props.port.fuelOil ||
      this.props.port.deck ||
      this.props.port.water ||
      this.props.port.dieselOil) { return <Table.Row>
        <Table.HeaderCell className="card-header-row" colSpan='3'>Supplies</Table.HeaderCell>
        </Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderPortAuthority = () => {
    if(this.props.port.portAuthority) { return <Table.Row>
      <Table.Cell>Port Authority</Table.Cell>
      <Table.Cell>{this.props.port.portAuthority}</Table.Cell></Table.Row>;
    } else { return <Table.Row></Table.Row>; }}

  renderLat = () => {
    if(this.props.port.latitude) { return <Table.Row>
        <Table.Cell>Latitude</Table.Cell>
        <Table.Cell>{this.props.port.latitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderLong = () => {
    if(this.props.port.longitude) { return <Table.Row>
        <Table.Cell>Longitude</Table.Cell>
        <Table.Cell>{this.props.port.longitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderddLong = () =>  {
    if(this.props.port.ddLongitude) {
      let array = this.props.descriptions.filter(item => item.name === "Decimal Degree Coordinates" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>DD Longitude</Table.Cell>
            <Table.Cell>{this.props.port.ddLongitude}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>DD Longitude</Table.Cell>
        <Table.Cell>{this.props.port.ddLongitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderddLat = () =>  {
    if(this.props.port.ddLatitude) {
      let array = this.props.descriptions.filter(item => item.name === "Decimal Degree Coordinates" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>DD Latitude</Table.Cell>
            <Table.Cell>{this.props.port.ddLatitude}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>DD Latitude</Table.Cell>
        <Table.Cell>{this.props.port.ddLatitude}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderPortType = () => {
    if(this.props.port.portType) {
      return <Table.Row>
          <Table.Cell>Port Type</Table.Cell>
          <Table.Cell>{this.props.port.portType}</Table.Cell></Table.Row>
    } else {
      return <Table.Row></Table.Row>;
    }}

  renderPortSize = () => {
    if(this.props.port.portSize) { return <Table.Row>
        <Table.Cell>Port Size</Table.Cell>
        <Table.Cell>{this.props.port.portSize}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderFirstEntry = () => {
    if(this.props.port.firstPortofEntry) {
      let array = this.props.descriptions.filter(item => item.name === "First Port of Entry" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>First Port of Entry</Table.Cell>
            <Table.Cell>{this.props.port.firstPortofEntry}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>First Port of Entry</Table.Cell>
        <Table.Cell>{this.props.port.firstPortofEntry}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderPublication = () => {
    if(this.props.port.publication) {
      let array = this.props.descriptions.filter(item => item.name === "Publication" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Publication</Table.Cell>
            <Table.Cell>{this.props.port.publication}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Publication</Table.Cell>
        <Table.Cell>{this.props.port.publication}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderChart = () => {
    if(this.props.port.chart) {
      let array = this.props.descriptions.filter(item => item.name === "Chart" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Chart</Table.Cell>
            <Table.Cell>{this.props.port.chart}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Chart</Table.Cell>
        <Table.Cell>{this.props.port.chart}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderUsaRep = () => {
    if(this.props.port.usaRep) {
      let array = this.props.descriptions.filter(item => item.name === "USA Representative" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>USA Representative</Table.Cell>
            <Table.Cell>{this.props.port.usaRep}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>USA Representative</Table.Cell>
        <Table.Cell>{this.props.port.usaRep}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderMedicalFacs = () => {
    if(this.props.port.medicalFacilities) {
      let array = this.props.descriptions.filter(item => item.name === "Medical Facilities" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Medical Facilities</Table.Cell>
            <Table.Cell>{this.props.port.medicalFacilities}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Medical Facilities</Table.Cell>
        <Table.Cell>{this.props.port.medicalFacilities}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderHarborSize = () => {
    if(this.props.port.harborSize) {
      let array = this.props.descriptions.filter(item => item.name === "Harbor Size" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Harbor Size</Table.Cell>
            <Table.Cell>{this.props.port.harborSize}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Harbor Size</Table.Cell>
        <Table.Cell>{this.props.port.harborSize}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderShelter = () => {
    if(this.props.port.shelter) {
      let array = this.props.descriptions.filter(item => item.name === "Shelter" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Shelter</Table.Cell>
            <Table.Cell>{this.props.port.shelter}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Shelter</Table.Cell>
        <Table.Cell>{this.props.port.shelter}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderMaxVesselSize = () => {
    if(this.props.port.maxVesselSize) {
      let array = this.props.descriptions.filter(item => item.name === "Maximum Vessel Size" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Maximum Vessel Size</Table.Cell>
            <Table.Cell>{this.props.port.maxVesselSize}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Maximum Vessel Size</Table.Cell>
        <Table.Cell>{this.props.port.maxVesselSize}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderHarborType = () => {
    if(this.props.port.harborType) {
      let array = this.props.descriptions.filter(item => item.name === "Harbor Type" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Harbor Type</Table.Cell>
            <Table.Cell>{this.props.port.harborType}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Harbor Type</Table.Cell>
        <Table.Cell>{this.props.port.harborType}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderTurningArea = () => {
    if(this.props.port.turningArea) {
      let array = this.props.descriptions.filter(item => item.name === "Turning Area" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Turning Area</Table.Cell>
            <Table.Cell>{this.props.port.turningArea}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Turning Area</Table.Cell>
        <Table.Cell>{this.props.port.turningArea}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderHoldingGround = () => {
    if(this.props.port.holdingGround) {
      let array = this.props.descriptions.filter(item => item.name === "Good Holding Ground" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Good Holding Ground</Table.Cell>
            <Table.Cell>{this.props.port.holdingGround}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Good Holding Ground</Table.Cell>
        <Table.Cell>{this.props.port.holdingGround}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderTide = () => {
    if(this.props.port.tide) {
      let array = this.props.descriptions.filter(item => item.name === "Tide" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Tide</Table.Cell>
            <Table.Cell>{this.props.port.tide}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Tide</Table.Cell>
        <Table.Cell>{this.props.port.tide}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderOverheadLimit = () => {
    if(this.props.port.overheadLimit) {
      let array = this.props.descriptions.filter(item => item.name === "Overhead Limit" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Overhead Limit</Table.Cell>
            <Table.Cell>{this.props.port.overheadLimit}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Overhead Limit</Table.Cell>
        <Table.Cell>{this.props.port.overheadLimit}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderSwell = () => {
    if(this.props.port.swell) { return <Table.Row>
        <Table.Cell>Swell</Table.Cell>
        <Table.Cell>{this.props.port.swell}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderPratique = () => {
    if(this.props.port.pratique) {
      let array = this.props.descriptions.filter(item => item.name === "Pratique" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Pratique</Table.Cell>
            <Table.Cell>{this.props.port.pratique}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Pratique</Table.Cell>
        <Table.Cell>{this.props.port.pratique}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderChannel = () => {
    if(this.props.port.channel) {
      let array = this.props.descriptions.filter(item => item.name === "Channel" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Channel</Table.Cell>
            <Table.Cell>{this.props.port.channel}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Channel</Table.Cell>
        <Table.Cell>{this.props.port.channel}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderCargoPier = () => {
    if(this.props.port.cargoPier) {
      let array = this.props.descriptions.filter(item => item.name === "Cargo Pier" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Cargo Pier</Table.Cell>
            <Table.Cell>{this.props.port.cargoPier}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Cargo Pier</Table.Cell>
        <Table.Cell>{this.props.port.cargoPier}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderMeanTide = () => {
    if(this.props.port.meanTide) { return <Table.Row>
        <Table.Cell>Mean Tide</Table.Cell>
        <Table.Cell>{this.props.port.meanTide} ft</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderAnchorage = () => {
    if(this.props.port.archorage) {
      let array = this.props.descriptions.filter(item => item.name === "Anchorage" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Anchorage</Table.Cell>
            <Table.Cell>{this.props.port.anchorage}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Anchorage</Table.Cell>
        <Table.Cell>{this.props.port.anchorage}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderOilTerminal = () => {
    if(this.props.port.oilTerminal) {
      let array = this.props.descriptions.filter(item => item.name === "Oil Terminal" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Oil Terminal</Table.Cell>
            <Table.Cell>{this.props.port.oilTerminal}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Oil Terminal</Table.Cell>
        <Table.Cell>{this.props.port.oilTerminal}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderCompulsory = () => {
    if(this.props.port.compulsory) {
      let array = this.props.descriptions.filter(item => item.name === "Compulsory" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Compulsory</Table.Cell>
            <Table.Cell>{this.props.port.compulsory}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Compulsory</Table.Cell>
        <Table.Cell>{this.props.port.compulsory}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderAvailable = () => {
    if(this.props.port.available) { return <Table.Row>
        <Table.Cell>Available</Table.Cell>
        <Table.Cell>{this.props.port.available}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderTugAssist = () => {
    if(this.props.port.tugAssistance) {
      let array = this.props.descriptions.filter(item => item.name === "Tug Assistance" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Tug Assistance</Table.Cell>
            <Table.Cell>{this.props.port.tugAssistance}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Tug Assistance</Table.Cell>
        <Table.Cell>{this.props.port.tugAssistance}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderTugSalvage = () => {
    if(this.props.port.tugSalvage) {
      let array = this.props.descriptions.filter(item => item.name === "Tug Salvage" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Tug Salvage</Table.Cell>
            <Table.Cell>{this.props.port.tugSalvage}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Tug Salvage</Table.Cell>
        <Table.Cell>{this.props.port.tugSalvage}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderWharves = () => {
    if(this.props.port.wharves) { return <Table.Row>
        <Table.Cell>Wharves</Table.Cell>
        <Table.Cell>{this.props.port.wharves}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderMedMoor = () => {
    if(this.props.port.medMoor) { return <Table.Row>
        <Table.Cell>Mediterranean Mooring</Table.Cell>
        <Table.Cell>{this.props.port.medMoor}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderHundredTonLifts = () => {
    if(this.props.port.hundredTonLifts) { return <Table.Row>
        <Table.Cell>100+ Ton Lifts</Table.Cell>
        <Table.Cell>{this.props.port.hundredTonLifts}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderFiftyTonLifts = () => {
    if(this.props.port.fiftyTonLifts) { return <Table.Row>
        <Table.Cell>50-100 Ton Lifts</Table.Cell>
        <Table.Cell>{this.props.port.fiftyTonLifts}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderTwentyTonLifts = () => {
    if(this.props.port.twentyTonLifts) { return <Table.Row>
        <Table.Cell>25-49 Ton Lifts</Table.Cell>
        <Table.Cell>{this.props.port.twentyTonLifts}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderZeroTonLifts = () => {
    if(this.props.port.zeroTonLifts) { return <Table.Row>
        <Table.Cell>0-24 Ton Lifts</Table.Cell>
        <Table.Cell>{this.props.port.zeroTonLifts}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderFixedCranes = () => {
    if(this.props.port.fixedCranes) { return <Table.Row>
        <Table.Cell>Fixed Cranes</Table.Cell>
        <Table.Cell>{this.props.port.fixedCranes}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderMobileCranes = () => {
    if(this.props.port.mobileCranes) { return <Table.Row>
        <Table.Cell>Mobile Cranes</Table.Cell>
        <Table.Cell>{this.props.port.mobileCranes}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderFloatingCranes = () => {
    if(this.props.port.floatingCranes) { return <Table.Row>
        <Table.Cell>Floating Cranes</Table.Cell>
        <Table.Cell>{this.props.port.floatingCranes}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderLongshore = () => {
    if(this.props.port.longshore) { return <Table.Row>
        <Table.Cell>Longshore</Table.Cell>
        <Table.Cell>{this.props.port.longshore}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderShipRepairs = () => {
    if(this.props.port.shipRepairs) {
      let array = this.props.descriptions.filter(item => item.name === "Ship Repairs" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Ship Repairs</Table.Cell>
            <Table.Cell>{this.props.port.shipRepairs}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Ship Repairs</Table.Cell>
        <Table.Cell>{this.props.port.shipRepairs}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderRail = () => {
    if(this.props.port.rail) { return <Table.Row>
        <Table.Cell>Rail</Table.Cell>
        <Table.Cell>{this.props.port.rail}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderMarineRail = () => {
    if(this.props.port.marineRailroadSize) {
      let array = this.props.descriptions.filter(item => item.name === "Marine Railroad" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Marine Railroad</Table.Cell>
            <Table.Cell>{this.props.port.marineRailroadSize}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Marine Railroad</Table.Cell>
        <Table.Cell>{this.props.port.marineRailroadSize}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderDrydock = () => {
    if(this.props.port.drydockSize) {
      let array = this.props.descriptions.filter(item => item.name === "Drydock Size" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Drydock Size</Table.Cell>
            <Table.Cell>{this.props.port.drydockSize}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Drydock Size</Table.Cell>
        <Table.Cell>{this.props.port.drydockSize}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderProvisions = () => {
    if(this.props.port.provisions) {
      let array = this.props.descriptions.filter(item => item.name === "Provisions" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Provisions</Table.Cell>
            <Table.Cell>{this.props.port.provisions}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Provisions</Table.Cell>
        <Table.Cell>{this.props.port.provisions}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderFuel = () => {
    if(this.props.port.fuelOil) {
      let array = this.props.descriptions.filter(item => item.name === "Fuel Oil" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Fuel Oil</Table.Cell>
            <Table.Cell>{this.props.port.fuelOil}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Fuel Oil</Table.Cell>
        <Table.Cell>{this.props.port.fuelOil}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderDeck = () => {
    if(this.props.port.deck) { return <Table.Row>
        <Table.Cell>Deck</Table.Cell>
        <Table.Cell>{this.props.port.deck}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderWater = () => {
    if(this.props.port.water) {
      let array = this.props.descriptions.filter(item => item.name === "Water" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Water</Table.Cell>
            <Table.Cell>{this.props.port.water}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Water</Table.Cell>
        <Table.Cell>{this.props.port.water}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}

  renderDiesel = () => {
    if(this.props.port.dieselOil) {
      let array = this.props.descriptions.filter(item => item.name === "Diesel Oil" );
      if(array) { return <Popup className="card-popup-box" on="click" content={array[0].description} trigger={
          <Table.Row className="card-column-popup">
            <Table.Cell>Diesel Oil</Table.Cell>
            <Table.Cell>{this.props.port.dieselOil}</Table.Cell>
          </Table.Row>} />}
      return <Table.Row>
        <Table.Cell>Diesel Oil</Table.Cell>
        <Table.Cell>{this.props.port.dieselOil}</Table.Cell></Table.Row>
    } else { return <Table.Row></Table.Row>; }}
}

export default (PortDataCard);

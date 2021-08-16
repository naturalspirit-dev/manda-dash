import React from 'react';
import Papa from 'papaparse';
import { Meteor } from 'meteor/meteor';
import {withRouter} from 'react-router-dom';
import { Loader, Button } from 'semantic-ui-react';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import * as utils from '../../utils/makeCamelCase.js';
import PortFiles from '../../api/ports/availablePortCSVFiles.json';
import AirfieldFiles from '../../api/airfields/availableAirfieldCSVFiles.json';
import { deleteEmptys, removeEmptys } from '../../utils/cleanObject.js';

/** Component to handle data flow.
 *  Runs python scraper to populate csv's in scraper/data.
 *  Converts csv's to JSON.
 *  Writes JSON to Mongo Collection.
 */
class DataController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            portData: [],
            airfieldData: [],
            loading: true,
            empty: false,
        };
    }

    componentDidMount() {
      this.getCsvData();
    }

    //inserts objects from JSON to PortsCollection
    async setPortData() {
      let n = 0;
      while(n < this.state.portData.length) {
        await Meteor.call("updatePort", this.state.portData[n]);
        n++;
      }
      return null;
    }

    //inserts objects from JSON to AirfieldsCollection
    async setAirfieldData() {
      let n = 0;
      while(n < this.state.airfieldData.length) {
        await Meteor.call("updateAirfield", this.state.airfieldData[n]);
        n++;
      }
      return null;
    }

    async runPython() {
      return new Promise((resolve, reject) => {
        const python = Meteor.call('consoleExecSync', function(error, result) {
          resolve("done");
        });
      });
    }

    //fetches all data from folder of csvs, adds to state
   async fetchScrapedData() {
      let i = 0;
      let j = 0;
      let csvData = "";
      Meteor.call('listPortCsv');
      Meteor.call('listAirfieldCsv');
      while(i < PortFiles.PortFiles.length) {
        //fetch csv data from each countrys file
        csvData = await this.fetchCsv("port", PortFiles.PortFiles[i].name);
        //parse csv data w/ headers attached
        let cleanArray = deleteEmptys(Papa.parse(csvData, { header: true }).data);
        //add a port object from each csv to state
        cleanArray.forEach(element => {
          this.setState({
            portData: this.state.portData.concat(element)
          })});
        i++;
      }
      while(j < AirfieldFiles.AirfieldFiles.length) {
        csvData = await this.fetchCsv("airfield", AirfieldFiles.AirfieldFiles[j].name);
        //parse csv data w/ headers attached
        let cleanArray = deleteEmptys(Papa.parse(csvData, { header: true }).data);
        //add an object from each csv to state
        cleanArray.forEach(element => {
          this.setState({
            airfieldData: this.state.airfieldData.concat(element)
        })});
        j++;
      }
    }

    //fetches an individual csv file from the server
    async fetchCsv(type, fileName) {
      return new Promise((resolve, reject) => {
        Meteor.call('fetchCsvFile', type, fileName, function(error, result) {
          if(error) {
            console.log(`Error fetching csv file in the client! Error message: ${error.message}`);
          }
          resolve(result);
        });
      });
    }

    //emptys out Port and Airfield collections
    emptyIfFull() {
      let msg = "Collection is full. Emptying now.";
      if (Ports.collection.find().count() > 200000) {
        console.log("Ports", msg);
        Meteor.call('removeAllPorts');
      }
      if (Airfields.collection.find().count() > 200000) {
        console.log("Airfields", msg);
        Meteor.call('removeAllAirfields');
      }
    }

    //parses CSV to JSON format, sets time of last scrape
    async getCsvData() {
        await this.emptyIfFull();
        await this.runPython();
        await this.fetchScrapedData();
        await this.setPortData();
        await this.setAirfieldData();
        Meteor.call('setTimeofScrape');
        this.setState({ loading: false });
    }

    render() { return(<div></div>); }

}

export default withRouter(DataController);

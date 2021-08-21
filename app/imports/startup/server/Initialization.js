import React from 'react';
import Papa from 'papaparse';
import { Meteor } from 'meteor/meteor';
import {withRouter} from 'react-router-dom';
import { Loader, Button } from 'semantic-ui-react';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import * as utils from '../../utils/makeCamelCase.js';
import { deleteEmptys, removeEmptys } from '../../utils/cleanObject.js';
const fs = require('fs');

/** Class to initialize mongo collections. To be called on first run **/
class Initialization extends React.Component {

  async listPortCsv() {
    return fs.readdirSync('../../../../../../scraper/data/port_data');
  }

  async listAirfieldCsv() {
    return fs.readdirSync('../../../../../../scraper/data/airfield_data');
  }

    //fetches all data from folder of csvs, adds to state
   async fetchScrapedData() {
      let i = 0;
      let j = 0;
      let csvPortData = "";
      let csvAirfieldData = "";
      let newPortData = [];
      let newAirfieldData = [];
      let portFiles = await this.listPortCsv();
      let airFieldFiles = await this.listAirfieldCsv();
      while(i < portFiles.length) {
        //fetch csv data from each countrys file
        csvPortData = await this.fetchCsv("port", portFiles[i]);
        //parse csv data w/ headers attached
        let cleanArray = deleteEmptys(Papa.parse(csvPortData, { header: true }).data);
        //add a port object from each csv to state
        cleanArray.forEach(element => {
          newPortData.push(element);
        });
        i++;
      }
      while(j < airFieldFiles.length) {
        csvAirfieldData = await this.fetchCsv("airfield", airFieldFiles[j]);
        //parse csv data w/ headers attached
        let cleanArray = deleteEmptys(Papa.parse(csvAirfieldData, { header: true }).data);
        //add an object from each csv to state
        cleanArray.forEach(element => { newAirfieldData.push(element) });
        j++;
      }
      this.setPortData(newPortData);
      this.setAirfieldData(newAirfieldData);
    }

    //fetches an individual csv file from the server
    async fetchCsv(type, fileName) {
        let result = await this.fetchCsvFile(type, fileName);
        return result;
    }

    async fetchCsvFile(type, fileName) {
      let data = "";
      return new Promise((resolve, reject) => {
        fs.readFile(`../../../../../../scraper/data/${type}_data/${fileName}`, (error, result) => {
          if(error) {
            console.log(`Error when fetching csv file from the server! Error message: ${error.message}`);
          }
          data = result.toString();
          resolve(data);
        });
      });
    }

    //inserts objects from JSON to PortsCollection
    async setPortData(newPortData) {
      let n = 0;
      while(n < newPortData.length) {
        await Meteor.call('updatePort', newPortData[n]);
        n++;
      }
      return null;
    }

    async setAirfieldData(newAirfieldData) {
      let n = 0;
      while(n < newAirfieldData.length) {
        await Meteor.call('updateAirfield', newAirfieldData[n]);
        n++;
      }
      return null;
    }

}

export default Initialization;

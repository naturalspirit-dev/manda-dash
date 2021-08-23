import React from 'react';
import { Meteor } from 'meteor/meteor';
import Papa from 'papaparse';
import { Card } from 'semantic-ui-react';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import Initialization from './Initialization';
import capitalizeWords from '../../utils/stringFormatting.js';
const util = require('util');
const fs = require('fs');

// Initialize the Collections if empty. (first run)
if (Ports.collection.find().count() === 0 || Airfields.collection.find().count() === 0) {
  console.log("Initializing database...")
  initializeCollections();
}

async function initializeCollections() {
  let init = new Initialization();
  await init.fetchScrapedData();
}

//Custom Meteor methods. Runs on server
Meteor.methods({
  //initialize front end Collections
  initalize: async function() {
    return new Promise(async (resolve, reject) => {
      let init = new Initialization();
      resolve(await init.fetchScrapedData());
    });
  },
  //builds src code for Google Maps iframe
  buildSrc: function(name, type, country) {
    return new Promise((resolve, reject) => {
      let itemType = "";
      let string = "https://www.google.com/maps/embed/v1/place?key=";
      if(type === "Port") {
        itemType = "Port+";
        name = capitalizeWords(name.toLowerCase());
      }
      let src = string.concat(
        Meteor.settings.GoogleMaps.key,
        "&q=",
        itemType,
        name,
        ",",
        country,
        "&zoom=14&maptype=satellite");
      resolve(src);
    });
  },
  //sets time of last scape to lastscrape.json
  setTimeofScrape: function() {
    let date = new Date();
    let curDay = date.toDateString();
    let curTime = date.toLocaleTimeString();
    try {
      fs.writeFileSync('../../../../../../app/imports/api/changes/lastscrape.json', JSON.stringify({"day": curDay, "time": curTime }));
    } catch (err) {
      console.error("Error while writing time of last scrape:", err.message)
    }
  },
  //fetches a csv file and returns it in String encoding
  fetchCsvFile: function(type, fileName) {
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
  },
  //write all available Port CSV's
  listPortCsv: function() {
    let files = fs.readdirSync('../../../../../../scraper/data/port_data');
    let myJson = [{}];
    for(let i = 0; i < files.length; i++){ //build json from files
      myJson[i] = {"name" : files[i]};
    }
    try {
      fs.writeFileSync('../../../../../../app/imports/api/ports/availablePortCSVFiles.json', JSON.stringify({"PortFiles": myJson}));
      //file written successfully
    } catch (err) {
      console.error(err)
    }
  },
  //write all available Airfield CSV's
  listAirfieldCsv: function() {
    let files = fs.readdirSync('../../../../../../scraper/data/airfield_data');
    let myJson = [{}];
    for(let i = 0; i < files.length; i++){ //build json from files
      myJson[i] = {"name" : files[i]};
    }
    try {
      fs.writeFileSync('../../../../../../app/imports/api/airfields/availableAirfieldCSVFiles.json', JSON.stringify({"AirfieldFiles": myJson}));
      //file written successfully
    } catch (err) {
      console.error(err)
    }
  },
  //execute scraper code method 1, fibers
  execShell: function() {
    var childProcess = require("child_process");
    Fiber = require('fibers');
    new Fiber(function(){
        childProcess.exec("python " + '../../../../../../scraper/run.py',
        function (error, stdout, stderr) {
            if (error) console.log(error);
            if (stdout) console.log(stdout);
            if (stderr) console.log(stderr);
        });
    }).run();
  },
  //execute scraper code method 2, async
  consoleExecSync : async function(seq) {
        const exec = require('child_process').exec;
  			var cmd = "python ../../../../../../scraper/run.py";
        const end = await execShellCommand(cmd);
        function execShellCommand(cmd) {
         return new Promise((resolve, reject) => {
          exec(cmd, (error, stdout, stderr) => {
           if (error) {
            console.warn(error);
           }
           resolve(stdout ? stdout : stderr);
          });
         });
        }
        if(end) {
          console.log("Scrape Complete\n", end)
          return "done";
        }
  },
  //remove all ports from PortsCollection
  removeAllPorts: function() {
    return Ports.collection.remove({});
  },
  //remove all airfields from AirfieldsCollection
  removeAllAirfields: function() {
    return Airfields.collection.remove({});
  },
  //update a port item in PortsCollection, if not found, insert
  updatePort: function(port) {
    if(Ports.collection.findOne({ portName: port.portName })) {
      return Ports.collection.update({ portName: port.portName }, {
          $set: {
                portName: port.portName,
                country: port.country,
                portAuthority: port.portAuthority,
                address: port.address,
                phone: port.phone,
                fax: port.fax,
                email: port.email,
                latitude: port.latitude,
                longitude: port.longitude,
                ddLatitude: port.ddLatitude,
                ddLongitude: port.ddLongitude,
                portType: port.portType,
                portSize: port.portSize,
                firstPortofEntry: port.firstPortofEntry,
                publication: port.publication,
                chart: port.chart,
                usaRep: port.usaRep,
                medicalFacilities: port.medicalFacilities,
                harborSize: port.harborSize,
                shelter: port.shelter,
                maxVesselSize: port.maxVesselSize,
                harborType: port.harborType,
                turningArea: port.turningArea,
                holdingGround: port.holdingGround,
                tide: port.tide,
                overheadLimit: port.overheadLimit,
                swell: port.swell,
                channel: port.channel,
                cargoPier: port.cargoPier,
                meanTide: port.meanTide,
                anchorage: port.anchorage,
                oilTerminal: port.oilTerminal,
                compulsory: port.compulsory,
                available: port.available,
                tugAssistance: port.tugAssistance,
                tugSalvage: port.tugSalvage,
                pratique: port.pratique,
                rail: port.rail,
                wharves: port.wharves,
                medMoor: port.medMoor,
                hundredTonLifts: port.hundredTonLifts,
                fiftyTonLifts: port.fiftyTonLifts,
                twentyTonLifts: port.twentyTonLifts,
                zeroTonLifts: port.zeroTonLifts,
                fixedCranes: port.fixedCranes,
                mobileCranes: port.mobileCranes,
                floatingCranes: port.floatingCranes,
                longshore: port.longshore,
                provisions: port.provisions,
                fuelOil: port.fuelOil,
                deck: port.deck,
                water: port.water,
                dieselOil: port.dieselOil,
                shipRepairs: port.shipRepairs,
                marineRailroadSize: port.marineRailroadSize,
                drydockSize: port.drydockSize,
              }
      });
    } else {
      Ports.collection.insert(port, (error) => {
        if (error) { console.log('Error', error.message, 'error'); }
      });
    }
  },

  //updates an airfield record with incoming data, if not found, insert
  updateAirfield: function(airfield) {
    if(Airfields.collection.findOne({airFieldName: airfield.airFieldName})) {
      return Airfields.collection.update(airfield, {
        $set: {
          airFieldName: airfield.airFieldName,
          country: airfield.country,
          icaoCodes: airfield.icaoCodes,
          latitude: airfield.latitude,
          longitude: airfield.longitude,
          ddLatitude: airfield.ddLatitude,
          ddLongitude: airfield.ddLongitude,
          airportUse: airfield.airportUse,
          weatherLink: airfield.weatherLink,
          runwayOneDimensions: airfield.runwayOneDimensions,
          runwayOneSurface: airfield.runwayOneSurface,
          runwayTwoDimensions: airfield.runwayTwoDimensions,
          runwayTwoSurface: airfield.runwayTwoSurface,
          runwayThreeDimensions: airfield.runwayThreeDimensions,
          runwayThreeSurface: airfield.runwayThreeSurface,
          runwayFourDimensions: airfield.runwayFourDimensions,
          runwayFourSurface: airfield.runwayFourSurface,
        }
      });
    } else {
      Airfields.collection.insert(airfield, (error) => {
        if (error) { console.log('Error', error.message, 'error'); }
      });
    }
  },
});

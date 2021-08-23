import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The PortsCollection. It encapsulates state and variable values for ports.
 * Declares DB schema for ports.
 */
class PortsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'PortsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      portName: { type: String, optional: false },
      country: { type: String, optional: false },
      portAuthority: String,
      address: String,
      phone: String,
      fax: String,
      email: String,
      latitude: String,
      ddLatitude: String,
      longitude: String,
      ddLongitude: String,
      portType: String,
      portSize: String,
      firstPortofEntry: String,
      publication: String,
      chart: String,
      usaRep: String,
      medicalFacilities: String,
      harborSize: String,
      shelter: String,
      maxVesselSize: String,
      harborType: String,
      turningArea: String,
      holdingGround: String,
      tide: String,
      overheadLimit: String,
      swell: String,
      channel: String,
      cargoPier: String,
      meanTide: String,
      anchorage: String,
      oilTerminal: String,
      compulsory: String,
      available: String,
      tugAssistance: String,
      tugSalvage: String,
      pratique: String,
      rail: String,
      wharves: String,
      medMoor: String,
      hundredTonLifts: String,
      fiftyTonLifts: String,
      twentyTonLifts: String,
      zeroTonLifts: String,
      fixedCranes: String,
      mobileCranes: String,
      floatingCranes: String,
      longshore: String,
      provisions: String,
      fuelOil: String,
      deck: String,
      water: String,
      dieselOil: String,
      shipRepairs: String,
      marineRailroadSize: String,
      drydockSize: String,
    }, {
      tracker: Tracker,
      requiredByDefault: false,
      clean: {
        filter: true,
        autoConvert: true,
        removeEmptyStrings: true,
        trimStrings: true,
        getAutoValues: true,
        removeNullsFromArrays: true,
      }});
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
  }
}

/**
 * The singleton instance of the PortsCollection.
 * @type {PortsCollection}
 */
export const Ports = new PortsCollection();

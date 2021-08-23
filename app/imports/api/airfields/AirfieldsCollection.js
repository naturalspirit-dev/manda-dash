import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The AirfieldsCollection. It encapsulates state and variable values for airfelds.
 * Declares DB schema for airfields.
 */
class AirfieldsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'AirfieldsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      airFieldName: { type: String, optional: false },
      country: { type: String, optional: false },
      icaoCodes: String,
      latitude: String,
      longitude: String,
      ddLatitude: String,
      ddLongitude: String,
      airportUse: String,
      weatherLink: String,
      runwayOneDimensions: { type: String, optional: true },
      runwayOneSurface: { type: String, optional: true },
      runwayTwoDimensions: { type: String, optional: true },
      runwayTwoSurface: { type: String, optional: true },
      runwayThreeDimensions: { type: String, optional: true },
      runwayThreeSurface: { type: String, optional: true },
      runwayFourDimensions: { type: String, optional: true },
      runwayFourSurface: { type: String, optional: true },
    }, { tracker: Tracker });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
  }
}
/**
 * The singleton instance of the AirfieldsCollection.
 * @type {AirfieldsCollection}
 */
export const Airfields = new AirfieldsCollection();

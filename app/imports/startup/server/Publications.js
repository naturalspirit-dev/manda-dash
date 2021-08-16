import { Meteor } from 'meteor/meteor';
import { Ports } from '../../api/ports/PortsCollection';
import { Airfields } from '../../api/airfields/AirfieldsCollection';

//Publish Mongo collections to app. Only return all fields.

// Publish ALL fields in Collections. No secret fields.
Meteor.publish(Ports.portName, function () {
  return Ports.collection.find({});
});

Meteor.publish(Airfields.name, function () {
  return Airfields.collection.find({});
});

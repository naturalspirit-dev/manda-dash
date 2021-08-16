import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import { Ports } from '../../api/ports/PortsCollection.js';
import { Airfields } from '../../api/airfields/AirfieldsCollection.js';
import {replaceCountryCode, replaceCountryName} from '../../utils/replaceCountryCode.js';
import capitalizeWords from '../../utils/stringFormatting.js';

/* Responsive dropdown component using hooks */
DropdownItem = (props) => {

  //sets nameOptions[] based on selected country
  validNames = (type, country) => {
    let n = 0;
    let checked = [];
    let valid = [];
    if(country == null) {
      return valid;
    } else if(type === "Port") {
        props.ports.map(port => {
          //if a ports country matches AND isnt already included
          if(replaceCountryCode(port.country) === country && !checked.includes(port.portName)) {
            valid.push({
              key: n,
              text: capitalizeWords(port.portName),
              value: n
            });
            checked.push(port.portName);
          }
          n++;
        });
    } else if (type === "Airfield") {
      props.airfields.map(airfield => {
        //if a ports country matches AND isnt already included
        if(replaceCountryCode(airfield.country) === country && !checked.includes(airfield.airFieldName)) {
          valid.push({
            key: n,
            text: airfield.airFieldName,
            value: n
          });
          checked.push(airfield.airFieldName);
        }
        n++;
      });
    }
    if(valid.length < 1) {
      valid.push({
        key: n + 1,
        content: <div onClick={link}><a href='#/docs'>Why is this list so short?</a></div>,
        value: n + 1
      });
    }
    return valid;
  }

  //returns array of valid countries based on type of port/airfield
  validCountries = (type) => {
    let n = 0;
    let valid = [];
    let checked = [];
    if(type === "Port") {
      props.ports.map(port => {
        if(!checked.includes(port.country)) {
          valid.push({
            key: n,
            flag: port.country.toLowerCase(),
            text: replaceCountryCode(port.country),
            value: n
          });
          checked.push(port.country)
          n++;
        }
      });
    } else if (type === "Airfield") {
      props.airfields.map(airfield => {
        if(!checked.includes(airfield.country)) {
          valid.push({
            key: n,
            flag: airfield.country.toLowerCase(),
            text: replaceCountryCode(airfield.country),
            value: n
          });
          checked.push(airfield.country)
          n++;
        }
      });
    }
    if(valid.length < 21) {
      valid.push({
        key: n + 1,
        content: <div onClick={link}><a href='#/docs'>Why is this list so short?</a></div>,
        value: n + 1
      });
    }
    return valid;
  }

  link = () => { return (<Redirect to='#/docs' />); }

  //runs on initial, sets value based on props.type
  setInline = async (value, type) => {
    if(type === "Location") {
      props.setLocationSelection(value);
      props.setNameSelection(`${value} Name`)
      props.setCountryOptions(validCountries(value));
    } else if(type === "Country") {
      props.setCountrySelection(value);
      props.setNameOptions(validNames(props.curLocation, value));
    } else if(type === "Name") {
      props.setNameSelection(value);
    } else {
      return console.log(`Bad value ${value} supplied to Dropdown DropdownItem`)
    }
  }

  const onChange = async (e, {value, options}) => {
    const selectedOption = options.find(elem => elem.value === value);
    if(props.initial) {  //if this is the first time
      setInline(selectedOption.text, props.type);
    } else {
      if(props.type === "Location") { //run non-initial
        props.setLocationSelection(selectedOption.text);
        props.setCountrySelection("Country");
        props.setNameSelection(`${selectedOption.text} Name`);
        props.setCountryOptions(validCountries(selectedOption.text));
        props.setNameOptions(validNames(selectedOption.text, null));
      } if(props.type === "Country") {
        props.setCountrySelection(selectedOption.text);
        props.setNameSelection(`${props.curLocation} Name`);
        props.setNameOptions(validNames(props.curLocation, selectedOption.text));
      } if(props.type === "Name") {
        props.setNameSelection(selectedOption.text);
      }
    }
    props.setInitial(false);
    event.preventDefault();
  }

  return(
      <div className="dropdown-item">
        <Dropdown
          search
          fluid
          selection
          closeOnChange= {true}
          text={props.text}
          options={props.options}
          onChange={onChange}
        />
      </div>
    );
}

export default withTracker((props) => {
  const subscription = Meteor.subscribe('PortsCollection');
  const subscription2 = Meteor.subscribe('AirfieldsCollection');
  const ports = Ports.collection.find({}).fetch();
  const airfields = Airfields.collection.find({}).fetch();
  return {
    ports,
    airfields,
  };
})(DropdownItem);

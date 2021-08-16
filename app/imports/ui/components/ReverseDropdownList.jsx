import React, { useState } from 'react';
import { Grid, Button, Dropdown, Icon } from 'semantic-ui-react';
import { withTracker, useTracker } from 'meteor/react-meteor-data';
import DropdownItem from '../components/DropdownItem'

/* Renders a dropdown for the lookup by country function */
export default ReverseDropdownList = (props) =>  {

  const locations = [
     {key: 1, text: 'Port', icon: 'pallet', value: 1},
     {key: 2, text: 'Airfield', icon: 'road', value: 2}
   ];

  let [ initial, setInitial ] = useState(true);

  let [ locationOptions, setLocationOptions ] = useState(locations);
  const [ locationSelection, setLocationSelection ] = useState("Port or Airfield");

  let [ countryOptions, setCountryOptions ] = useState([{
    key: 1,
    text:'Please Select Port or Airfield',
    value: 1,
    disabled: true
  }]);
  const [ countrySelection, setCountrySelection ] = useState("Country");

  let [ nameOptions, setNameOptions ] = useState([{
    key:1,
    text:'Please Select Country',
    value:1,
    disabled: true
  }]);
  const [ nameSelection, setNameSelection ] = useState("Name");

  //set results to object
  search = () => {
    props.handleResult({
      location: locationSelection,
      country: countrySelection,
      name: nameSelection
    });
  }

  return (
    <div className="dropdown-list">
      <DropdownItem
        type="Location"
        key="location-dropdown"
        placeholder={locationSelection}
        text={locationSelection}
        options={locationOptions}
        curLocation={locationSelection}
        initial={initial}
        setInitial={setInitial}
        setLocationSelection={setLocationSelection}
        setCountryOptions={setCountryOptions}
        setCountrySelection={setCountrySelection}
        setNameSelection={setNameSelection}
        setNameOptions={setNameOptions} />
      <DropdownItem
        type="Country"
        key="country-dropdown"
        placeholder={countrySelection}
        text={countrySelection}
        options={countryOptions}
        curLocation={locationSelection}
        initial={initial}
        setInitial={setInitial}
        setLocationSelection={setLocationSelection}
        setCountryOptions={setCountryOptions}
        setCountrySelection={setCountrySelection}
        setNameSelection={setNameSelection}
        setNameOptions={setNameOptions} />
      <div className="search-button-wrapper">
        <Button content="Search" floated="left" color="blue" size="big" onClick={this.search} />
      </div>
    </div>
  );
}

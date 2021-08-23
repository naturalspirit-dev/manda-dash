/* Methods to sort Port and Airfield Javascript objects */

//returns list of countries or names, sorted alphebetically by first letter of first name
export function sortItems(array) {
  return array.sort(check);
}

function check(a,b) {
  if (a.text < b.text){
    return -1;
  }
  if (a.text > b.text){
    return 1;
  }
  return 0;
}

//returns list of countries or names, sorted alphebetically by first letter of first name
export function sortTabs(array) {
  return array.sort(checkTab);
}

function checkTab(a,b) {
  if (a.menuItem < b.menuItem){
    return -1;
  }
  if (a.menuItem > b.menuItem){
    return 1;
  }
  return 0;
}

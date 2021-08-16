/* String formatting functions for front end rendering */

const capitalizeWords = function(string) {
  //return string.charAt(0).toUpperCase() + string.slice(1);
  return string.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

export default capitalizeWords;

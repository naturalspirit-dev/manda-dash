/* methods to clean port and airfield objects */

//recursively removes all bad items from object
const removeEmptys = function (obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null && v != "")
      .map(([k, v]) => [k, v === Object(v) ? removeEmptys(v) : v])
  );
}

//deletes objects with bad items from array of objects
const deleteEmptys = function (array) {
  return array.filter((item) => {
    if(item.portName || item.airFieldName) {
      return item;
    }
  });
}

export {removeEmptys, deleteEmptys};

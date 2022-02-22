const Chance = require("chance");

const chance = new Chance();
const chanceTypes = Object.keys(Object.getPrototypeOf(chance));

function valid(type) {
  return chanceTypes.indexOf(type) !== -1;
}

function getArrayValue(definition) {
  const type = definition[0];
  const count = definition[1];
  const options = definition[2];

  if(typeof type === "object"){
    // array of objects
    return new Array(count).fill(null).map(function() {
      return createData(type);
    });
  }

  if (!valid(type) || typeof count !== "number" || count === 0) {
    return null;
  }
  return new Array(count).fill(null).map(function() {
    return getValue(type, options);
  });
}

function getValue(type, options) {
  if (Array.isArray(type)) {
    return getArrayValue(type);
  }
  if (typeof type === "object" && !Array.isArray(type) && type != null) {
    return createData(type);
  }
  try {
    return chance[type](options);
  } catch (exception) {
    return null;
  }
}

function createData(template) {
  const output = {};
  Object.keys(template).map(function(key, index) {
    let value = template[key];
    let type;
    let optionsObj = null;
    // has options?
    if (typeof value !== "object" && value.indexOf(',') > -1){
      type = value.substring(0, value.indexOf(","));
      const options = value.substring(value.indexOf(",") + 1, value.length);
      optionsObj = eval("(" + options + ")");
    } else {
      type = value;
    }
    output[key] = getValue(type, optionsObj);
  });
  return output;
}

module.exports = createData;

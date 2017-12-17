var {encode, decode} = require('jsmoves');

var x = () => {
  console.log(1);
};

var y = (func) => () => {
  func();
}

y()();

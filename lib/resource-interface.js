  // data, // where the wrapped obj (interface) lives // accessed via select.
  // raw, // original object.
  // api, // somehow explains to developers how to use the obj.
  // manifest: // type checking information
  //
  // forEach() {},
  // every() {},
  // filter() {},
  // some() {},
  // find() {},
  //
  // clone() {},
  //
  // select(...args) {}, // .select() w/ no params returns this.data (whole obj)
  // get() {},
  // set() {}, // set w/ property specific validation.

// interface API
// - .select()
// - .get()
// - .set()
// - .info() // works at all levels.
// - .location() // @todo new name // basically pwd.
// - ... all interface methods

// every object needs a name field. REQUIRED

const {isType} = require('./utils');

module.exports = (data, schema = {}) => {

  if (!isType(data, 'object')) throw new Error(`Type "Object" required.`);

  return {
    data,
    raw: obj,
  };

  // Modify obj by reference. No need for .map();
  obj.forEach = (cb) => {
    var keys;
    keys = Object.keys(data);
    keys.forEach(key => cb(data[key], key));
    return obj;
  };

  // @return Boolean
  obj.every = (cb) => {
    var keys, result;
    keys = Object.keys(data);
    result = keys.every(key => cb(data[key], key));
    return result;
  };

  // @return Boolean
  obj.some = (cb) => {
    var keys, result;
    keys = Object.keys(data);
    result = keys.some(key => cb(data[key], key));
    return result;
  };

  // @return Object.
  obj.find = (cb, returnObj = true) => {
    var keys, result;
    keys = Object.keys(data);
    result = keys.find(key => cb(data[key], key));
    return returnObj ? {key: result, value: data[result]} : data[result];
  };

  // filter does not modify the original dataset, but the returned object does reference the original obj.
  obj.filter = (cb) => {
    var keys, obj1 = {};
    keys = Object.keys(data);
    keys
      .filter(key => cb(data[key], key))
      .forEach(key => {
        obj1[key] = new Proxy(obj1, {
          get(target, property) {
            return obj[property];
          },
          set(target, property, value) {
            obj[property] = value;
          }
        });
      });
    return self.createResourceCollection(obj1);
  };

  obj.clone = (obj) => {
    return {...obj};
  };

  obj.assign = (...args) => {
    return self.objectAssignDeep(...args);
  };

  return obj1;



};

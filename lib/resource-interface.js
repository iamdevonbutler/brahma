
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
// The "commands" config resource, see ./config/commands.js, can be nested deeply on
// the "subcommands" property - make it easy to interface w/.
// test async shit
// docs. creates a new obj. no refence shit.
const {isType, objectAssign} = require('./utils');

const self = module.exports;

self.applyObjectInterface = (data) => {

  if (!isType(data, 'object')) throw new Error(`Type "Object" required.`);

  var obj = {
    data: objectAssign({}, data),
  };

  /**
   * Itterate over each object property.
   * @param  {Function} cb params: value, key
   * @return {this}
   */
  obj.forEach = (cb) => {
    var keys;
    keys = Object.keys(obj.data);
    keys.forEach(key => cb(obj.data[key], key));
    return obj;
  };

  /**
   * Itterate over each object property and set it's value equal to the
   * callback return value.
   * @param  {Function} cb params: value, key
   * @return {this}
   */
  obj.map = (cb) => {
    var keys, values;
    keys = Object.keys(obj.data);
    values = keys.map(key => cb(obj.data[key], key));
    keys.forEach((key, i) => obj.data[key] = values[i]);
    return obj;
  };


  /**
   * Itterate over each object property and if every callback returns `true`, return `true`,
   * if not, return `false`.
   * @param  {Function} cb params: value, key
   * @return {Boolean}
   */
  obj.every = (cb) => {
    var keys, result;
    keys = Object.keys(obj.data);
    result = keys.every(key => cb(obj.data[key], key));
    return result;
  };

  /**
   * Itterate over each object property and if at least one callback returns `true`, return `true`,
   * if not, return `false`.
   * @param  {Function} cb params: value, key
   * @return {Boolean}
   */
  obj.some = (cb) => {
    var keys, result;
    keys = Object.keys(obj.data);
    result = keys.some(key => cb(obj.data[key], key));
    return result;
  };

  /**
   * Itterate over each object property return the first property for which the callback
   * returns a truthy value. If `returnObj` == true, we return the key and value encapsulated
   * in an object, otherwise we return just the value.
   * @param  {Function} cb params: value, key
   * @param  {Boolean} [returnObj=false]
   * @return {Object}
   */
  obj.find = (cb, returnObj = false) => {
    var keys, result;
    keys = Object.keys(obj.data);
    result = keys.find(key => cb(obj.data[key], key));
    return returnObj ? {key: result, value: obj.data[result]} : obj.data[result];
  };

  /**
   * Removes properties from obj where `cb` returned falsy. Returns a new Object that references
   * the original.
   * @param  {Function} cb params: value, key
   * @param  {Boolean} [map=false]
   * @return {Object}
   */
  obj.filter = (cb, map = false) => {
    var keys, obj1 = {};
    keys = Object.keys(obj.data);
    keys
      .filter(key => cb(obj.data[key], key))
      .forEach(key => {
        obj1[key] = new Proxy(obj.data[key], {
          get(target, property) {
            return obj.data[property];
          },
          set(target, property, value) {
            obj.data[property] = value;
          }
        });
      });
    return self.applyObjectInterface(obj1);
  };

  /**
   * Create a copy (deep) of an object. Creates a new reference.
   * @param  {Object} obj
   * @return {Object}
   */
  obj.clone = (obj) => {
    return objectAssign({}. obj);
  };

  /**
   * Create a new object inheriting properties from the original and deeply assign new properties.
   * @param  {Object} obj
   * @return {Object}
   */
  obj.assign = (...args) => {
    return self.objectAssign(obj.data, ...args);
  };

  return obj;
};

self.applyResourceInterface = (data, schema = {}) => {

  if (!isType(data, 'object')) throw new Error(`Type "Object" required.`);

  return {
    data,
    raw: obj,
  };

};

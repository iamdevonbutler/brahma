const {createSchema} = require('../');

module.exports = createSchema({
  depth: 0,
  deferred: {
    keys: {
      each(key, value, {apps}) {
        return {
          error: Object.keys(apps).indexOf(key) > -1 ? null : 'invalid appname', // validate w/ error
          value: undefined, // transform
        };
      },
    },
  },
},
{
  depth: 1,
  keys: {
    all(keys) {
      return {
        error: keys.indexOf('local') > -1 ? null : 'must include local',
      }
    }
  }
},
{
  depth: 2,
  keys: {
    required: ['port'],
  },
  values: {
   schema: createSchema({
     depth: 0, // default
     fields: {
       value: {
         required() {
           return 'this is the error';
         },
         transform() {

         }
       },
       refresh: {

       }
     }
   }),
  },
});

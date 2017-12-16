module.exports = () => {
  var envSchema = createSchema(0, 1, 2);
  var fieldSchema = createSchema(0);
  envSchema(0).validate.each.key((key, value, {apps}) => {
    return {
      error: Object.keys(apps).indexOf(key) > -1 ? null : 'invalid appname', // validate w/ error
      value: undefined, // transform
    };
  });
  envSchema(1).validate.all.keys(keys => {
    return {
      error: keys.indexOf('local') > -1 ? null : 'must include local',
    }
  });
  envSchema(2).validate.required.keys('port');
  fieldSchema.transform.each.value(value => {
    return value === 'object' ? value : { value };
  });
  fieldSchema.assign.default.values({overwrite: true, refresh: true})
  fieldSchema.validate.all.values.by.type({
     allows: ['object', 'string'],
     error(value, type) {
       return 'expected object or string';
     },
  })
  fieldSchema.validate.fields({
   value: {
     required() {
       return 'this is the error';
     },
     transform(value) {}
   },
   refresh: {
    type: {
      allows: ['boolean'],
      error() {

      }
    }
   }
  });
  fieldSchema.validate.every.field(schema {
    needs: ['value', 'refresh', 'overwrite'], // needs keys. i dont think we need to list values here, we do that w/ the other props.
    required() {}, // required will never be called if we only itterate over the fields they give us.
    // @todo, need an actual schema.
  });
  envSchema.values.schema(fieldSchema);
  return envSchema;
};

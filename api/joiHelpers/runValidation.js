const Joi = require('joi');

module.exports = (object, schema) => {
  let result = {};

  Joi.validate(object, schema, {
    abortEarly: false, language: { key: '' },
  }, (err, value) => {
    if (err) {
      let index = 0;
      const obj = {};
      err.details.forEach((item, i, arr) => {
        if (!obj[item.context.key]) {
          obj[item.context.key] = {};
          index = 0;
        }
        obj[item.context.key][index] = item.message;
        index += 1;
      });
      result = obj;
    } else {
      result = false;
    }
  });

  return result;
};

const Joi = require('joi');

const userSchema = Joi.object().keys({
  id: Joi.number().min(1).required(),
});

module.exports = userSchema;

const Joi = require('joi');

const wordsSchema = Joi.object()
  .keys({
    words: Joi.object().required(),
  })
  .required();

module.exports = wordsSchema;

const Joi = require('joi');

const getWords = Joi.object().keys({
  counter: Joi.number().min(1),
  page: Joi.number().min(1),
  withoutTranslation: Joi.boolean().valid(true),
  protect: Joi.boolean(),
});

module.exports = getWords;

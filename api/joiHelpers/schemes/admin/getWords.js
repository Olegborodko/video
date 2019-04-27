const Joi = require('joi');

const getWords = Joi.object().keys({
  counter: Joi.number(),
  page: Joi.number(),
});

module.exports = getWords;

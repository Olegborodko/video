const Joi = require('joi');

const changeWord = Joi.object()
  .keys({
    id: Joi.number().required(),
    en: Joi.string(),
    ru: Joi.string(),
    counter: Joi.number(),
    protect: Joi.boolean(),
  })
  .or('en', 'ru', 'counter', 'protect');

module.exports = changeWord;

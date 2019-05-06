const Joi = require('joi');

const changeWord = Joi.object()
  .keys({
    id: Joi.number().required(),
    en: Joi.string().allow(''),
    ru: Joi.string().allow(''),
    counter: Joi.number(),
    protect: Joi.boolean(),
  })
  .or('en', 'ru', 'counter', 'protect');

module.exports = changeWord;

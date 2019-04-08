const Joi = require('joi');

const subtitlesSchema = Joi.object().keys({
  subtitles: Joi.array().items(
    Joi.object().keys({
      start: Joi.string(),
      dur: Joi.string(),
      text: Joi.string().required(),
    }),
  ).required(),
}).required();

module.exports = subtitlesSchema;

const Joi = require('joi');

const schema = Joi.object().keys({
  video_identifier: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  thumbnails: Joi.string().required(),
});

module.exports = schema;

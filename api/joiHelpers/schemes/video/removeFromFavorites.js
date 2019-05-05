const Joi = require('joi');

const schema = Joi.object().keys({
  video_id: Joi.number().required(),
});

module.exports = schema;

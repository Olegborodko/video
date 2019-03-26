const Joi = require('joi');

const videoLink = Joi.object().keys({
  link: Joi.string().min(5).required(),
});

module.exports = videoLink;

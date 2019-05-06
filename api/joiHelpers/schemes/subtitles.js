const Joi = require('joi');

const subtitlesSchema = Joi.object().keys({
  subtitles: Joi.object()
    .keys({
      text: Joi.array()
        .items(
          Joi.object().keys({
            $t: Joi.string().required(),
            start: Joi.string().allow(''),
            dur: Joi.string().allow(''),
          }),
        )
        .required(),
    })
    .required(),
});

module.exports = subtitlesSchema;

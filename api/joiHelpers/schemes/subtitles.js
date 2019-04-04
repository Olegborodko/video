const Joi = require('joi');

// const subtitlesSchema = Joi.array().items(
// 		Joi.object().keys({
// 			start: Joi.string().required(),
//             dur: Joi.string().required(),
//             text: Joi.string().required()
// 		})
// 	).required();

const subtitlesSchema = Joi.object().keys({
	subtitles: Joi.array().items(
		Joi.object().keys({
			start: Joi.string().required(),
            dur: Joi.string().required(),
            text: Joi.string().required()
		})
	).required()
}).required();

module.exports = subtitlesSchema;
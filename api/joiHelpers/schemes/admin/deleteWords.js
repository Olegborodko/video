const Joi = require('joi');

// a: Joi.alternatives().when('b', { is: true, then: Joi.required() }),
// counter: Joi.when('ids', { is: true, then: Joi.required() }),

const deleteWords = Joi.object()
  .keys({
    counter: Joi.number().min(1),
    ids: Joi.array()
      .min(1)
      .items(Joi.number()),
    withoutTranslation: Joi.boolean().valid(true),
  })
  .or('counter', 'ids', 'withoutTranslation');

module.exports = deleteWords;

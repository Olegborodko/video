const Joi = require('joi');

module.exports = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
});

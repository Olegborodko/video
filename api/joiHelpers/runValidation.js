const Joi = require('joi');

module.exports = (requestBody, schema) =>
{
    let result = {};

    Joi.validate(requestBody, schema, {
        abortEarly: false, language: {key: ''}
    }, function (err, value) {
        if (err) {
            let index = 0;
            const obj = {};
            err.details.forEach(function (item, i, arr) {
                if (!obj[item.context.key]) {
                    obj[item.context.key] = {}
                    index = 0;
                }
                obj[item.context.key][index] = item.message;
                index += 1;
            });
            result = obj;
        } else {
            result = false;
        }
    });

    return result;
}
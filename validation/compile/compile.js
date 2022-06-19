const { validate, Joi } = require('express-validation')
const compileValidation = {
    body: Joi.object({
        userId: Joi.string().required(),
        questionId: Joi.string().required(),
        sourceCode: Joi.string().required(),
    }),
}

module.exports = validate(compileValidation, {}, {})

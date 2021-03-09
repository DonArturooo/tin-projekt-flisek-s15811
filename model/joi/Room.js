const Joi = require('joi');

const errMessages = (errors) => {
    errors.forEach(err => {
        switch (err.code) {
            case "number.base":
                err.message = "Pole jest wymagane";
                break;
            case "number.min":
                err.message = `Minimalna wartość to ${err.local.limit}`;
                break;
            case "number.max":
                err.message = `Maksymalna wartość to ${err.local.limit}`;
                break;
            case "number.unsafe":
                err.message = `Przekroczono maksymalny limit znaków`;
                break;  
            default:
                break;
        }
    });
    return errors;
}

const roomSchema = Joi.object({
    _id: Joi.number()
        .optional()
        .allow(""),
    numberRoom: Joi.number()
        .min(1)
        .max(100)
        .required()
        .error(errMessages),
    numberOfSpace: Joi.number()
        .min(1)
        .max(5)
        .required()
        .error(errMessages),
});



module.exports = roomSchema;
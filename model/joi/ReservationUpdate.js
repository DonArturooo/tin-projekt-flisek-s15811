const Joi = require('joi');

const errMessages = (errors) => {
    errors.forEach(err => { 
        switch (err.code) {
            case "string.empty":
                err.message = "Pole jest wymagane";
                break;
            case "string.min":
                err.message = `Pole powinno zawierać co najmniej ${err.local.limit} znaki`;
                break;
            case "string.max":
                err.message = `Pole powinno zawierać co najwyżej ${err.local.limit} znaki`;
                break;
            case "string.email":
                err.message = `Pole powinno zawierać prawidłowy adres email`;
                break;
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
            case "date.base":
                err.message = `Podaj prawidłową datę`;
                break;
            case "date.min":
                err.message = `Data nie może być wcześniejsza niż dzisiaj`;
                break;
            case "date.max":
                err.message = `Data nie może być późniejsz niż 2022-12-31`;
                break;
            default:
                break;
        }
    });
    return errors;
}

const reservationSchema = Joi.object({
    _id: Joi.number()
        .optional()
        .allow("")
        .error(errMessages),
    dateTo: Joi.date()
        .min('2020-01-01')
        .max('2022-12-31')
        .required()
        .error(errMessages),
    dateFrom: Joi.date()
        .min('2020-01-01')
        .max('2022-12-31')
        .required()
        .error(errMessages),
    visitors: Joi.number()
        .min(1)
        .max(5)
        .required()
        .error(errMessages),
    room: Joi.object()
        .required()
        .error(errMessages),
    client: Joi.object()
        .required()
        .error(errMessages),
    spendDays: Joi.number()
        .allow('')
        .optional()
        .min(0)
        .error(errMessages),
});

module.exports = reservationSchema;
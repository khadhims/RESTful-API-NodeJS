import Joi from "joi";

const createAddressValidation = Joi.object({
    street     : Joi.string().optional().max(255),
    city       : Joi.string().optional().max(50),
    province   : Joi.string().optional().max(50),
    country    : Joi.string().required().max(50),
    postal_code: Joi.string().optional().max(10)
});

const getAddressValidation    = Joi.number().required().positive().min(1);

const updateAddressValidation = Joi.object({
    id         : Joi.number().required().positive().min(1),
    street     : Joi.string().optional().max(255),
    city       : Joi.string().optional().max(50),
    province   : Joi.string().optional().max(50),
    country    : Joi.string().optional().max(50),
    postal_code: Joi.string().optional().max(10)
});

export {
    createAddressValidation,
    getAddressValidation,
    updateAddressValidation
}
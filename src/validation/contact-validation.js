import Joi from "joi";

const createContactValidation = Joi.object({
    firstName: Joi.string().required().max(50),
    lastName : Joi.string().required().max(50),
    email    : Joi.string().email().required().max(50),
    phone    : Joi.string().required().max(50),
});

const getContactValidation   = Joi.number().required().positive();

const updateContactValidation = Joi.object({
    id       : Joi.number().positive().required(),
    firstName: Joi.string().optional().max(50),
    lastName : Joi.string().optional().max(50),
    email    : Joi.string().email().optional().max(50),
    phone    : Joi.string().optional().max(50),
});

const searchContactValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(10).positive().default(10),
    name : Joi.string().optional().max(50),
    email: Joi.string().email().optional().max(50),
    phone: Joi.string().optional().max(50),
});

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    searchContactValidation
}
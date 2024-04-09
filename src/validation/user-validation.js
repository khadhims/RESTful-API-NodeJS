import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().required().max(50),
    email   : Joi.string().email().required().max(50),
    name    : Joi.string().required().max(100),
    password: Joi.string().required().max(100)
});

const loginUserValidation    = Joi.object({
    username: Joi.string().required().max(50),
    password: Joi.string().required().max(50)
});

const getUserValidation      = Joi.string().required().max(100);

const updateUserValidation   = Joi.object({
    username: Joi.string().required().max(50),
    email   : Joi.string().email().optional().max(50),
    name    : Joi.string().optional().max(100),
    password: Joi.string().optional().max(100)
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}
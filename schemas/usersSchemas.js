import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerUserSchema = Joi.object({
    name: Joi.string().min(1).trim(),
    email: Joi.string().pattern(emailRegexp).lowercase().trim().required(),
    password: Joi.string().min(6).trim().required()
})

export const loginUserSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).lowercase().trim().required(),
    password: Joi.string().min(6).trim().required()
})
import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(1).max(25).trim(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().trim().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(1).max(25).trim(),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().trim(),
  favorite: Joi.boolean(),
}).min(1).message('Body must have at least one field');

export const patchContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
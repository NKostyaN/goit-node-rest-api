import Joi from "joi";
import { emailRegexp } from "../constants/auth-constants.js";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().trim().pattern(emailRegexp).required(),
    phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().trim().pattern(emailRegexp),
    phone: Joi.string(),
});

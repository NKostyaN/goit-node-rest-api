import Joi from "joi";
import { emailRegexp } from "../constants/auth-constants.js";
import { subscriptionTypes } from "../constants/subscription-constants.js";

export const registerSchema = Joi.object({
    email: Joi.string().trim().pattern(emailRegexp).required(),
    password: Joi.string().trim().min(6).required(),
    subscription: Joi.string()
        .valid(...subscriptionTypes)
        .default("starter"),
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().pattern(emailRegexp).required(),
    password: Joi.string().trim().min(6).required(),
});

export const verifySchema = Joi.object({
    email: Joi.string().trim().pattern(emailRegexp).required(),
});

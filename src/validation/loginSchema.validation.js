import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "string.password": "Please enter a valid password.",
    "string.empty": "Password is required.",
  }),
  deviceFingerprint: Joi.string().optional(),
}).unknown(true);

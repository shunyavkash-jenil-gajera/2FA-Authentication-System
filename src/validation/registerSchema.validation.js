import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).required().messages({
    "string.empty": "First name is required.",
    "string.min": "First name must be at least 2 characters long.",
    "any.required": "First name is required.",
  }),

  lastName: Joi.string().trim().min(2).required().messages({
    "string.empty": "Last name is required.",
    "string.min": "Last name must be at least 2 characters long.",
    "any.required": "Last name is required.",
  }),

  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "string.password": "Please enter a valid password.",
    "string.empty": "Password is required.",
  }),
});

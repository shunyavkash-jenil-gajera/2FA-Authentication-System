import Joi from "joi";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

export const registerSchema = Joi.object({
  userName: Joi.string().trim().min(2).required().messages({
    "string.empty": "User Name is required.",
    "string.min": "User Name must be at least 2 characters long.",
    "any.required": "User Name is required.",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().pattern(strongPasswordRegex).required().messages({
    "string.pattern.base":
      "Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*#?&)",
  }),
});

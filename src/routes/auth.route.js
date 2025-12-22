import { Router } from "express";
import { Register } from "../controller/register.controller.js";
import { validationErrorHandler } from "../middleware/validationErrorHandler.middleware.js";
import { registerSchema } from "../validation/registerSchema.validation.js";

const accountRoutes = Router;

accountRoutes.post(
  "/register",
  validationErrorHandler(registerSchema),
  Register
);

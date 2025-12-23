// import { Router } from "express";
import express from "express";
import { Register } from "../controller/register.controller.js";
import { validationErrorHandler } from "../middleware/validationErrorHandler.middleware.js";
import { registerSchema } from "../validation/registerSchema.validation.js";

const router = express.Router();

router.post("/register", validationErrorHandler(registerSchema), Register);

export default router;

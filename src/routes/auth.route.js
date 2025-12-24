// import { Router } from "express";
import express from "express";
import { Register } from "../controller/register.controller.js";
import { validationErrorHandler } from "../middleware/validationErrorHandler.middleware.js";
import { registerSchema } from "../validation/registerSchema.validation.js";
import { logIn } from "../controller/login.controller.js";
import { generate2fa } from "../controller/generate2fa.controller.js";

const router = express.Router();

router.post("/register", validationErrorHandler(registerSchema), Register);
router.post("/login", logIn);

router.post("/enable-2fa", generate2fa);

export default router;

// import { Router } from "express";
import express from "express";
import passport from "passport";
import { validationErrorHandler } from "../middleware/validationErrorHandler.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { Register } from "../controller/register.controller.js";
import { logIn } from "../controller/login.controller.js";
import { generate2fa } from "../controller/generate2fa.controller.js";
import { verifyOtp } from "../controller/verifyOtp.controller.js";
import {
  googleAuthCallback,
  googleAuthFailure,
} from "../controller/googleAuth.controller.js";

import { registerSchema } from "../validation/registerSchema.validation.js";
import { loginSchema } from "../validation/loginSchema.validation.js";
import { LogOut, LogOutAll } from "../controller/logout.controller.js";
import { FRONTEND_URL } from "../config/environment.config.js";

const router = express.Router();

router.post("/register", validationErrorHandler(registerSchema), Register);

router.post("/login", validationErrorHandler(loginSchema), logIn);

router.post("/enable-2fa", authMiddleware, generate2fa);

router.post("/verifyOtp", authMiddleware, verifyOtp);

router.post("/logout", authMiddleware, LogOut);

router.post("/logout-all", authMiddleware, LogOutAll);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleAuthCallback
);

router.get("/google/failure", googleAuthFailure);

export default router;

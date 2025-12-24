// import { Router } from "express";
import express from "express";
import passport from "passport";
import { Register } from "../controller/register.controller.js";
import { validationErrorHandler } from "../middleware/validationErrorHandler.middleware.js";
import { registerSchema } from "../validation/registerSchema.validation.js";
import { logIn } from "../controller/login.controller.js";
import { generate2fa } from "../controller/generate2fa.controller.js";
import { googleAuthCallback, googleAuthFailure } from "../controller/googleAuth.controller.js";

const router = express.Router();

router.post("/register", validationErrorHandler(registerSchema), Register);
router.post("/login", logIn);
router.post("/enable-2fa", generate2fa);

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
    failureRedirect: "/api/v1/auth/google/failure",
  }),
  googleAuthCallback
);

router.get("/google/failure", googleAuthFailure);

export default router;

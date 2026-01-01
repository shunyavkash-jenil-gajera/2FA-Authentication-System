import express from "express";
import passport from "passport";
import { validationErrorHandler } from "../middleware/validationErrorHandler.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  deviceFingerprintMiddleware,
  checkTrustedDevice,
} from "../middleware/deviceFingerprint.middleware.js";
import { checkSessionExpiry } from "../middleware/sessionExpiry.middleware.js";

import { Register } from "../controller/register.controller.js";
import { logIn } from "../controller/login.controller.js";
import { enable2fa } from "../controller/enable2fa.controller.js";
import { verifyOtp } from "../controller/verifyOtp.controller.js";
import {
  googleAuthCallback,
  googleAuthFailure,
} from "../controller/googleAuth.controller.js";
import { logoutFromDevice } from "../controller/logoutFromDevice.controller.js";

import { registerSchema } from "../validation/registerSchema.validation.js";
import { loginSchema } from "../validation/loginSchema.validation.js";
import { LogOut, LogOutAll } from "../controller/logout.controller.js";
import { disable2fa } from "../controller/disable2fa.controller.js";

const router = express.Router();

router.post(
  "/register",
  validationErrorHandler(registerSchema),
  deviceFingerprintMiddleware,
  Register
);

router.post(
  "/login",
  validationErrorHandler(loginSchema),
  deviceFingerprintMiddleware,
  checkTrustedDevice,
  logIn
);

router.post("/enable-2fa", checkSessionExpiry, authMiddleware, enable2fa);
router.post("/disable-2fa", checkSessionExpiry, authMiddleware, disable2fa);

router.post("/verifyOtp", checkSessionExpiry, authMiddleware, verifyOtp);

router.post("/logout", checkSessionExpiry, authMiddleware, LogOut);

router.post("/logout-all", checkSessionExpiry, authMiddleware, LogOutAll);

router.post(
  "/logout-device",
  checkSessionExpiry,
  authMiddleware,
  logoutFromDevice
);

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

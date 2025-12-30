import express from "express";
import { home } from "../controller/home.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { GetUserLoginAccount } from "../controller/GetUserLoginAccount.controller.js";

const router = express.Router();

router.get("/", authMiddleware, home);
router.get("/login-accounts", authMiddleware, GetUserLoginAccount);

export default router;

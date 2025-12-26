import express from "express";
import { home } from "../controller/home.controller.js";
import { GetUserLoginAccount } from "../controller/GetUserLoginAccount.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, home);
router.get("/login-accounts", authMiddleware, GetUserLoginAccount);

export default router;

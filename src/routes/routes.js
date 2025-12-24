import authRouter from "./auth.route.js";
import express from "express";
const router = express.Router();

// Auth Routes
router.use("/auth", authRouter);

export default router;

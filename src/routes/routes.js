import authRouter from "./auth.route.js";
import homeRouter from "./home.route.js";
import express from "express";
const router = express.Router();

// Auth Routes
router.use("/auth", authRouter);
router.use("/dashboard", homeRouter);

export default router;

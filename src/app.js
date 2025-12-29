import express from "express";
import passport from "passport";
import { SendResponse } from "./utils/sendResponse.util.js";
import router from "./routes/routes.js";
import "./services/passport.service.js";
import { setupPassport } from "./services/passport.service.js";
import { globalErrorHandler } from "./utils/global.error.handler.js";
import { FRONTEND_URL } from "./config/environment.config.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

setupPassport(passport);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log(req.body, "body");
  return SendResponse(res, 200, true, "App is running");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
console.log("WelCome 2FA Authentication System");

export default app;

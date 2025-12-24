import express from "express";
import passport from "passport";
import { SendResponse } from "./utils/sendResponse.util.js";
import router from "./routes/routes.js";
import "./services/passport.service.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.post("/api/data", (req, res) => {
  console.log(req, "Request");
  res.send("Data received");
});

app.get("/", (req, res) => {
  console.log(req.body, "body");
  return SendResponse(res, 200, true, "App is running");
});

app.use("/api/v1", router);
console.log("WelCome 2FA Authentication System");

export default app;

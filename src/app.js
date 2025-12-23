import express from "express";
import { SendResponse } from "./utils/sendResponse.util.js";
import router from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req.body, "body");
  return SendResponse(res, 200, true, "App is running");
});

app.use("/api/v1", router);
console.log("WelCome 2FA Authentication System");

export default app;

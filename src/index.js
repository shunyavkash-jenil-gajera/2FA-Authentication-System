import express from "express";
import { PORT } from "./config/environment.config.js";
import { connectDB } from "./config/connectDB.js";
import { SendResponse } from "./utils/sendResponce.util.js";

const app = express();
connectDB();

app.use((req, res) => {
  return SendResponse(res, 404, false, `Not Found:${req.originalUrl}`);
});

app.listen(PORT, async () => {
  console.log(`server is listening on port ${PORT}`);
});

import { SendResponse } from "./sendResponse.util.js";

export const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.log("GLOBAL ERROR HANDLER TRIGGERED");
  console.log(`API Error in: ${req.method} ${req.originalUrl}`);
  console.log("Message:", err.message);

  return SendResponse(
    res,
    err.statusCode || 500,
    false,
    err.message || "Internal Server Error",
    null
  );
};

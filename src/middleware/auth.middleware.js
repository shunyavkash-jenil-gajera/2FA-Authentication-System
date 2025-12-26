import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRETE } from "../config/environment.config.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import User from "../model/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.error("No token provided in Authorization header");
      return SendResponse(res, 400, false, "No token provided");
    }

    if (token.split(".").length < 0) {
      return SendResponse(res, 400, false, "Malformed token");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRETE);

    if (!decodedToken?.id) {
      console.error("Decoded token does not contain user ID:", decodedToken);
      return SendResponse(
        res,
        400,
        false,
        "Unauthorized request: Invalid token payload"
      );
    }

    const user = await User.findById(decodedToken?.id).select(
      "-password -secrete2fa"
    );

    if (!user) {
      console.error("User not found for token:", decodedToken);
      return SendResponse(
        res,
        401,
        false,
        "Unauthorized request: User not found"
      );
    }

    req.user = { ...user?._doc, accessToken: token };
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return SendResponse(
      res,
      401,
      false,
      error?.message || "Invalid access token"
    );
  }
};

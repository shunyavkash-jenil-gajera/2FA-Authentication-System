import { SendResponse } from "../utils/sendResponse.util.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { generateAccessToken } from "../services/token.service.js";
import Session from "../model/session.model.js";

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    const { accessToken } = await generateAccessToken({
      id: user._id,
    });
    

    res.header("accessToken", accessToken);

    await Session.create({
      userId: user._id,
      accessToken,
      ip: req.ip,
      deviceName: req.deviceName,
      os: req.os,
      isActive: true,
    });

    return SendResponse(
      res,
      200,
      true,
      SUCCESS_MESSAGE.USER_LOGGED_IN || "User logged in with Google",
      {
        user,
        accessToken,
      }
    );
  } catch (error) {
    console.error("Google OAuth Callback Error:", error.message || error);
    return SendResponse(res, 500, false, "Google authentication failed");
  }
};

export const googleAuthSuccess = (req, res) => {
  return SendResponse(res, 400, false, "Google authentication failed");
};
export const googleAuthFailure = (req, res) => {
  return SendResponse(res, 400, false, "Google authentication failed");
};

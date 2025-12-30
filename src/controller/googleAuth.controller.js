import { SendResponse } from "../utils/sendResponse.util.js";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { generateAccessToken } from "../services/token.service.js";
import Session from "../model/session.model.js";
import { FRONTEND_URL } from "../config/environment.config.js";

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    const { accessToken } = await generateAccessToken({
      id: user._id,
    });

    await Session.create({
      userId: user._id,
      accessToken,
      ip: req.ip,
      deviceName: req.device.type,
      os: req.os,
      isActive: true,
    });
    console.log(user, "user");

    const frontendCallbackUrl = `${FRONTEND_URL}/auth-callback?token=${accessToken}&user=${user}`;
    return res.redirect(frontendCallbackUrl);
  } catch (error) {
    console.error("Google OAuth Callback Error:", error.message || error);
    return res.redirect(`${FRONTEND_URL}/login`);
  }
};

export const googleAuthFailure = (req, res) => {
  return SendResponse(
    res,
    400,
    false,
    ERROR_MESSAGE.GOOGLE_AUTHENTICATION_FAILED
  );
};

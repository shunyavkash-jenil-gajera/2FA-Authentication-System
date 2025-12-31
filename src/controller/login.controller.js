import Session from "../model/session.model.js";
import User from "../model/user.model.js";
import { generateAccessToken } from "../services/token.service.js";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const logIn = async (req, res) => {
  try {
    const { email, password, deviceFingerprint } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_PASSWORD);
    }

    // Check if user has a trusted device with this fingerprint
    const trustedDevice = await Session.findOne({
      userId: user._id,
      deviceFingerprint,
      isTrustedDevice: true,
      twoFaExpiry: { $gt: new Date() }, // Only check 2FA expiry (15 days)
      is2FaComplete: true,
    });

    const { accessToken } = await generateAccessToken({
      id: user._id,
      email: user.email,
    });

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password");

    // Calculate expiry time (15 days for 2FA)
    const twoFaExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      userId: loggedInUser._id,
      accessToken,
      ip: req.ip,
      deviceName: req.device.type,
      os: req.os,
      deviceFingerprint: deviceFingerprint || null,
      isActive: true,
      is2FaComplete: trustedDevice ? true : false, // Skip 2FA if trusted device
      isTrustedDevice: trustedDevice ? true : false,
      twoFaExpiry,
    });

    return SendResponse(res, 200, true, SUCCESS_MESSAGE.USER_LOGGED_IN, {
      user: loggedInUser,
      accessToken,
      skipTwoFA: trustedDevice ? true : false,
      session,
    });
  } catch (error) {
    console.error("Login Error:", error.message || error);
    return SendResponse(res, 500, false, ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

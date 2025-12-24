import User from "../model/user.model.js";
import speakeasy from "speakeasy";
import { SendResponse } from "../utils/sendResponse.util.js";
import Session from "../model/session.model.js";

export const verifyOtp = async (req, res) => {
  try {
    const { otp, _id, accessToken } = req.body;
    // const { _id, accessToken } = req.user;
    console.log(req.user, "req user");

    const user = await User.findById(_id).select("+secrete2fa");

    const isVerified = speakeasy.totp.verify({
      secret: user.secrete2fa,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isVerified) {
      return SendResponse(res, 400, false, "Invalid OTP");
    }
    user.enabled_2fa = true;
    await user.save();
    const session = await Session.create({
      userId: createdUser._id,
      accessToken: accessToken,
      ip: req.ip,
      deviceName: req.deviceName,
      os: req.os,
      isActive: true,
    });

    return SendResponse(res, 200, true, "2FA enabled successfully", {
      isVerified: isVerified,
      session,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

import User from "../model/user.model.js";
import speakeasy from "speakeasy";
import { SendResponse } from "../utils/sendResponse.util.js";
import Session from "../model/session.model.js";
import { ERROR_MESSAGE } from "../utils/constants.util.js";

export const verifyOtp = async (req, res) => {
  try {
    const { otp, accessToken } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id).select("+secrete2fa");

    if (!user || !user.secrete2fa) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.SECRET_NOT_FOUND);
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.secrete2fa,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isVerified) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_OTP);
    }
    user.enabled_2fa = true;
    await user.save();
    const twoFaExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const updatedSession = await Session.findOneAndUpdate(
      { accessToken: accessToken },
      {
        is2FaComplete: true,
        isTrustedDevice: true,
        twoFaExpiry,
      },
      { new: true }
    );

    return SendResponse(res, 200, true, "2FA enabled successfully", {
      isVerified: isVerified,
      updatedSession,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

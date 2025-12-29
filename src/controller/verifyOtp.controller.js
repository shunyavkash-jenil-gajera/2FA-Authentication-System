import User from "../model/user.model.js";
import speakeasy from "speakeasy";
import { SendResponse } from "../utils/sendResponse.util.js";
import Session from "../model/session.model.js";

export const verifyOtp = async (req, res) => {
  try {
    const { otp, accessToken } = req.body;
    const { _id } = req.user;

    console.log(otp, accessToken, _id, "data");

    const user = await User.findById(_id).select("+secrete2fa");

    if (!user || !user.secrete2fa) {
      return SendResponse(
        res,
        400,
        false,
        "2FA secret not found. Please enable 2FA first."
      );
    }

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
    const updatedSession = await Session.findOneAndUpdate(
      { accessToken: accessToken },
      { is2FaComplete: true },
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

import User from "../model/user.model.js";
import speakeasy from "speakeasy";
import { SendResponse } from "../utils/sendResponse.util.js";
import Session from "../model/session.model.js";

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { user, accessToken } = req.user;

    const users = await User.findById(user._id).select("+secrete2fa");

    const isVerified = speakeasy.totp.verify({
      secret: users.secrete2fa,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isVerified) {
      return SendResponse(res, 400, false, "Invalid OTP");
    }
    users.enabled_2fa = true;
    await users.save();

    const updatedSeller = await Session.findByIdAndUpdate(
      accessToken,
      { is2FaComplete },
      { new: true }
    );

    return SendResponse(res, 200, true, "2FA enabled successfully", {
      isVerified: isVerified,
      updatedSeller,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

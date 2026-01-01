import User from "../model/user.model.js";
import speakeasy from "speakeasy";
import { SendResponse } from "../utils/sendResponse.util.js";
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from "../utils/constants.util.js";

export const disable2fa = async (req, res) => {
  try {
    const { _id } = req.user;
    const { password, otp } = req.body;

    // Validate required fields
    if (!password || !otp) {
      return SendResponse(res, 400, false, "Password and OTP are required");
    }

    // Get user with password field
    const user = await User.findById(_id).select("+password +secrete2fa");

    if (!user) {
      return SendResponse(res, 404, false, ERROR_MESSAGE.USER_NOT_FOUND);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return SendResponse(res, 400, false, "Invalid password");
    }

    // Verify 2FA is enabled
    if (!user.enabled_2fa || !user.secrete2fa) {
      return SendResponse(res, 400, false, "2FA is not enabled");
    }

    // Verify OTP
    const isOTPValid = speakeasy.totp.verify({
      secret: user.secrete2fa,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isOTPValid) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_OTP);
    }

    // Disable 2FA
    await User.findByIdAndUpdate(_id, {
      secrete2fa: "",
      enabled_2fa: false,
    });

    return SendResponse(res, 200, true, "2FA disabled successfully", { enabled_2fa: false });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

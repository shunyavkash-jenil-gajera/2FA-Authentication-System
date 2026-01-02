import User from "../model/user.model.js";
import speakeasy from "speakeasy";
import { SendResponse } from "../utils/sendResponse.util.js";
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from "../utils/constants.util.js";

export const disable2fa = async (req, res) => {
  try {
    const { _id } = req.user;
    const { password, otp } = req.body;

    const user = await User.findById(_id).select("+password +secrete2fa");

    if (!user) {
      return SendResponse(res, 404, false, ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_PASSWORD);
    }

    if (!user.enabled_2fa || !user.secrete2fa) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.NOT_ENABLED);
    }

    const isOTPValid = speakeasy.totp.verify({
      secret: user.secrete2fa,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isOTPValid) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_OTP);
    }

    await User.findByIdAndUpdate(_id, {
      secrete2fa: "",
      enabled_2fa: false,
    });

    return SendResponse(res, 200, true, SUCCESS_MESSAGE.DISABLED_2FA, {
      enabled_2fa: false,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

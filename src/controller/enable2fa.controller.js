import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../model/user.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";

export const enable2fa = async (req, res) => {
  try {
    const { _id, email } = req.user;

    const existingUser = await User.findById(_id).select("+secrete2fa");

    let secretToUse;
    if (existingUser?.secrete2fa) {
      secretToUse = existingUser.secrete2fa;
    } else {
      const secretKey = speakeasy.generateSecret({ length: 25 });
      secretToUse = secretKey.base32;

      await User.findByIdAndUpdate(_id, {
        secrete2fa: secretToUse,
      });
    }

    const otpUrl = `otpauth://totp/${encodeURIComponent(
      email
    )}?secret=${secretToUse}`;

    const qrCodeDataURL = await QRCode.toDataURL(otpUrl);

    return SendResponse(res, 200, true, SUCCESS_MESSAGE.SECRET_GENERATED, {
      qrCodeDataURL,
      secret: secretToUse,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

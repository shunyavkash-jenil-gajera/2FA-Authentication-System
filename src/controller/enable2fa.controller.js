import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../model/user.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";

export const enable2fa = async (req, res) => {
  try {
    const { _id, email } = req.user;

    // Check if user already has a secret - if yes, return it
    const existingUser = await User.findById(_id).select("+secrete2fa");

    let secretToUse;
    if (existingUser?.secrete2fa) {
      // Secret already exists, use it
      secretToUse = existingUser.secrete2fa;
    } else {
      // Generate new secret only if it doesn't exist
      const secretKey = speakeasy.generateSecret({ length: 25 });
      secretToUse = secretKey.base32;

      // Save the secret
      await User.findByIdAndUpdate(_id, {
        secrete2fa: secretToUse,
      });
    }

    const otpUrl = `otpauth://totp/${encodeURIComponent(email)}?secret=${secretToUse}`;

    // Generate QR code URL
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

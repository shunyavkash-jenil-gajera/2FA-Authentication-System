import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../model/user.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";

export const enable2fa = async (req, res) => {
  try {
    const { _id, email } = req.user;
    const secretKey = speakeasy.generateSecret({ length: 25 });

    const otpUrl = `otpauth://totp/${encodeURIComponent(email)}?secret=${
      secretKey.base32
    }`;

    // Generate QR code URL
    const qrCodeDataURL = await QRCode.toDataURL(otpUrl);

    await User.findByIdAndUpdate(_id, {
      secrete2fa: secretKey.base32,
      enabled_2fa: true,
    });

    return SendResponse(res, 200, true, SUCCESS_MESSAGE.SECRET_GENERATED, {
      qrCodeDataURL,
      secret: secretKey.base32,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

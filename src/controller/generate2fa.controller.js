import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../model/user.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const generate2fa = async (req, res) => {
  try {
    const { _id } = req.user;
    const secretKey = speakeasy.generateSecret({ length: 20 });

    console.log(secretKey, "secretKey");

    // Generate QR code URL
    function generateQRCodeURL() {
      return new Promise((resolve, reject) => {
        QRCode.toDataURL(secretKey.otpauth_url, (err, dataURL) => {
          if (err) {
            reject(err);
          } else {
            resolve(dataURL);
          }
        });
      });
    }

    // Generate and await the QR code URL
    const qrCodeDataURL = await generateQRCodeURL();

    console.log("Scan the QR code with the Google Authenticator app:");
    console.log(qrCodeDataURL, "qrCodeDataURL");

    await User.findByIdAndUpdate(_id, {
      secrete2fa: secretKey.base32,
      enabled_2fa: true,
    });

    return SendResponse(res, 200, true, "2FA secret generated", {
      qrCodeDataURL,
      secret: secretKey.base32,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

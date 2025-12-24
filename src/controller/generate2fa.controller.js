import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../model/user.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const generate2fa = async (req, res) => {
  try {
    const { _id } = req.body;
    const secretKey = speakeasy.generateSecret({ length: 20 });

    console.log(secretKey, "secretKey");
    // const otpauthUrl = secretKey.otpauth_url;
    // const qrCodeDataURL = QRCode.toDataURL(otpauthUrl);
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

    // Generate and display the QR code URL
    const qrCodeDataURL = generateQRCodeURL()
      .then((dataURL) => {
        console.log("Scan the QR code with the Google Authenticator app:");
        console.log(dataURL);
        return dataURL;
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
      });

    console.log(qrCodeDataURL, "qrCodeDataURL");
    await User.findByIdAndUpdate(_id, {
      secrete2fa: secretKey.base32,
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

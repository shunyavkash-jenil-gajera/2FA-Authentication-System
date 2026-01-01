import { SendResponse } from "../utils/sendResponse.util.js";

export const disable2fa = async (req, res) => {
  try {
    const { _id, email, accessToken } = req.user;
    await User.findByIdAndUpdate(_id, {
      secrete2fa: "",
      enabled_2fa: false,
    });
  } catch (error) {
    console.log(error);
    return SendResponse(res, 500, false, error.message);
  }
};

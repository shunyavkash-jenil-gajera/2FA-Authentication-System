import User from "../model/user.modle.js";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const Register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return SendResponse(res, 404, false, ERROR_MESSAGE.EMAIL_ALREADY_TAKEN);
    console.log(userName, email, password);

    const data = await User.create({
      userName,
      email,
      password,
    });
    return SendResponse(res, 200, true, SUCCESS_MESSAGE.USER_REGISTERED, data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

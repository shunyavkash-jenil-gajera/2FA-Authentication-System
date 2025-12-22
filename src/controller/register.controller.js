import Account from "../model/user.modle.js";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponce.util.js";

export const Register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return SendResponse(res, 404, false, ERROR_MESSAGE.EMAIL_ALREADY_TAKEN);

    const data = await Account.create({
      firstName,
      lastName,
      email,
      password,
    });
    return SendResponse(res, 200, true, SUCCESS_MESSAGE.USER_REGISTERD, data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

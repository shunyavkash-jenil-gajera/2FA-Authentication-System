import User from "../model/user.model.js";
import { generateAccessAndRefreshTokens } from "../services/token.services.js";
import { SendResponse } from "../utils/sendResponse.util.js";
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return SendResponse(res, 400, false, ERROR_MSG.USER_NOT_FOUND);
  }

  const isPasswordValid = user.password === password;
  if (!isPasswordValid) {
    return SendResponse(res, 400, false, ERROR_MSG.INVALID_PASSWORD);
  }
  try {
    const { accessToken } = await generateAccessAndRefreshTokens({
      id: user._id,
    });

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res.status(200).cookie("accessToken", accessToken, cookieOptions);

    return SendResponse(res, 200, true, SUCCESS_MSG.USER_LOGGED_IN, {
      user: loggedInUser,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error.message || error);
    return SendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};

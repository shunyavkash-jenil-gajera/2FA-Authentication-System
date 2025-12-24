import Session from "../model/session.model.js";
import User from "../model/user.model.js";
import { generateAccessAndRefreshTokens } from "../services/token.service.js";
import { SendResponse } from "../utils/sendResponse.util.js";
export const logIn = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }).select("+password +twoFactorSecret");

  if (!user) {
    return SendResponse(res, 400, false, ERROR_MSG.USER_NOT_FOUND);
  }

  const isPasswordValid = await user.comparePassword(password);

  // const isPasswordValid = user.password === password;
  if (!isPasswordValid) {
    return SendResponse(res, 400, false, ERROR_MSG.INVALID_PASSWORD);
  }

  if (user.enabled_2fa) {
    return SendResponse(res, 200, true, "2FA required", {
      require2FA: true,
      accountId: account._id,
    });
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

    const session = await Session.create({
      userId: loggedInUser._id,
      accessToken: token,
      ip: req.ip,
      deviceName: req.deviceName,
      os: req.os,
      isActive: true,
    });
    return SendResponse(res, 200, true, SUCCESS_MSG.USER_LOGGED_IN, {
      user: loggedInUser,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error.message || error);
    return SendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};

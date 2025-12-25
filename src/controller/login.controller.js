import Session from "../model/session.model.js";
import User from "../model/user.model.js";
import { generateAccessToken } from "../services/token.service.js";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_PASSWORD);
    }

    if (!user.enabled_2fa) {
      return SendResponse(res, 200, true, "2FA required", {
        require2FA: true,
        UserId: user._id,
      });
    }

    const { accessToken } = await generateAccessToken({
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

    await Session.create({
      userId: loggedInUser._id,
      accessToken,
      ip: req.ip,
      deviceName: req.deviceName,
      os: req.os,
      isActive: true,
    });
    return SendResponse(res, 200, true, SUCCESS_MESSAGE.USER_LOGGED_IN, {
      user: loggedInUser,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error.message || error);
    return SendResponse(res, 500, ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

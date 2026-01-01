import jwt from "jsonwebtoken";
import { SendResponse } from "../utils/sendResponse.util.js";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRETE,
} from "../config/environment.config.js";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../utils/constants.util.js";
import User from "../model/user.model.js";
import Session from "../model/session.model.js";

export const Register = async (req, res) => {
  try {
    const { userName, email, password, deviceFingerprint } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.EMAIL_ALREADY_TAKEN);
    }

    const newUser = await User.create({
      userName,
      email,
      password,
    });
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      ACCESS_TOKEN_SECRETE,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );

    const createdUser = await User.findById(newUser._id).select("-password ");

    if (!createdUser) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.USER_REGISTER_ERROR);
    }

    const twoFaExpiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      userId: createdUser._id,
      accessToken: token,
      ip: req.ip,
      deviceName: req.device.type,
      os: req.os,
      deviceFingerprint: deviceFingerprint || null,
      isActive: true,
      twoFaExpiry,
    });

    return SendResponse(res, 200, true, SUCCESS_MESSAGE.USER_REGISTERED, {
      user: createdUser,
      session: session,
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error.message || error);
    return SendResponse(res, 500, false, ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

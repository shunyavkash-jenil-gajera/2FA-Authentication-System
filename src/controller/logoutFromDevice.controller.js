import Session from "../model/session.model.js";
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import { Types } from "mongoose";

export const logoutFromDevice = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const { _id: userId } = req.user;

    if (!sessionId || !Types.ObjectId.isValid(sessionId)) {
      return SendResponse(res, 400, false, ERROR_MESSAGE.INVALID_SESSION);
    }

    const deletedSession = await Session.findOneAndDelete({
      _id: sessionId,
      userId,
    });

    if (!deletedSession) {
      return SendResponse(res, 404, false, ERROR_MESSAGE.SESSION_NOT_FOUND);
    }

    return SendResponse(res, 200, true, SUCCESS_MESSAGE.DEVICE_LOGGED_OUT, {
      deviceName: deletedSession.deviceName,
      os: deletedSession.os,
    });
  } catch (error) {
    console.error("Logout from device error:", error);
    return SendResponse(res, 500, false, error.message);
  }
};

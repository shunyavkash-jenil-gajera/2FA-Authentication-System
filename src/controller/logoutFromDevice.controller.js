import Session from "../model/session.model.js";
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import { Types } from "mongoose";

export const logoutFromDevice = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const { _id: userId } = req.user;

    if (!sessionId || !Types.ObjectId.isValid(sessionId)) {
      return SendResponse(res, 400, false, "Invalid session ID");
    }

    const deletedSession = await Session.findOneAndDelete({
      _id: sessionId,
      userId,
    });

    if (!deletedSession) {
      return SendResponse(res, 404, false, "Session not found");
    }

    return SendResponse(res, 200, true, "Device logged out successfully", {
      deviceName: deletedSession.deviceName,
      os: deletedSession.os,
    });
  } catch (error) {
    console.error("Logout from device error:", error);
    return SendResponse(res, 500, false, error.message);
  }
};

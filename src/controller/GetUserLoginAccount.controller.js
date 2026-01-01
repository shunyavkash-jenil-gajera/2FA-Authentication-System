import Session from "../model/session.model.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const GetUserLoginAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const sessions = await Session.find({
      userId: _id,
      isActive: true,
    })
      .select("_id ip deviceName os createdAt twoFaExpiry isTrustedDevice")
      .lean();

    const formattedSessions = sessions.map((session) => ({
      sessionId: session._id,
      ip: session.ip || "Unknown",
      deviceName: session.deviceName || "Unknown Device",
      os: session.os || "Unknown OS",
      loginDate: session.createdAt,
      is2FaExpired: new Date(session.twoFaExpiry) < new Date(),
      isTrustedDevice: session.isTrustedDevice,
    }));

    return SendResponse(
      res,
      200,
      true,
      SUCCESS_MESSAGE.USER_LOGIN_ACCOUNTS,
      formattedSessions
    );
  } catch (error) {
    return SendResponse(res, 500, false, error.message);
  }
};

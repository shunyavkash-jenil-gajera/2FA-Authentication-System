import Session from "../model/session.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";
import { ERROR_MESSAGE } from "../utils/constants.util.js";

export const checkSessionExpiry = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next();
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      return next();
    }

    const now = new Date();

    if (
      session.deviceTrustExpiry &&
      new Date(session.deviceTrustExpiry) < now
    ) {
      await Session.findByIdAndDelete(session._id);
      return SendResponse(res, 401, false, ERROR_MESSAGE.SESSION_EXPIRED);
    }

    if (
      session.is2FaComplete &&
      session.twoFaExpiry &&
      new Date(session.twoFaExpiry) < now
    ) {
      await Session.findByIdAndUpdate(session._id, {
        is2FaComplete: false,
      });
      return SendResponse(
        res,
        401,
        false,
        ERROR_MESSAGE.EXPIRED_2FA_VERIFICATION
      );
    }

    await Session.findByIdAndUpdate(session._id, {
      lastActive: new Date(),
    });

    next();
  } catch (error) {
    console.error("Session expiry check error:", error);
    next();
  }
};

import Session from "../model/session.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const GetUserLoginAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const sessions = await Session.find({
      userId: _id,
      is2FaComplete: true,
    }).lean();

    if (!sessions || sessions.length === 0) {
      return SendResponse(res, 200, false, "Login Accounts", []);
    }

    return SendResponse(res, 200, true, "User Login Accounts", sessions);
  } catch (error) {
    return SendResponse(res, 500, false, error.message);
  }
};

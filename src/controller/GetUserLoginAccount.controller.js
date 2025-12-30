import Session from "../model/session.model.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const GetUserLoginAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const sessions = await Session.find({
      userId: _id,
      is2FaComplete: true,
    }).lean();

    return SendResponse(
      res,
      200,
      true,
      SUCCESS_MESSAGE.USER_LOGIN_ACCOUNTS,
      sessions
    );
  } catch (error) {
    return SendResponse(res, 500, false, error.message);
  }
};

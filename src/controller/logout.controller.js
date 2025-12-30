import Session from "../model/session.model.js";
import { SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const LogOut = async (req, res) => {
  try {
    const { accessToken } = req.user;
    if (accessToken) {
      await Session.findOneAndDelete(accessToken);
    }
    SendResponse(res, 200, true, SUCCESS_MESSAGE.USER_LOGGED_OUT);
  } catch (error) {
    return SendResponse(res, 500, false, error.message);
  }
};

export const LogOutAll = async (req, res) => {
  try {
    const { _id } = req.user;

    const result = await Session.deleteMany({ userId: _id });

    const count = result.deletedCount;

    return SendResponse(
      res,
      200,
      true,
      SUCCESS_MESSAGE.ALL_USER_LOGGED_OUT,
      count
    );
  } catch (error) {
    return SendResponse(res, 500, false, error.message);
  }
};

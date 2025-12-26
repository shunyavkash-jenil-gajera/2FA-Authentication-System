import Session from "../model/session.model.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const LogOut = async (req, res) => {
  try {
    const { accessToken } = req.user;
    if (accessToken) {
      await Session.findOneAndDelete(accessToken);
    }
    SendResponse(res, 200, true, "Logout user");
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
      "Logged out from all devices successfully",
      count
    );
  } catch (error) {
    return SendResponse(res, 500, false, error.message);
  }
};

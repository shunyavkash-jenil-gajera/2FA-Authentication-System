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
    // req.user already contains user data
    const userId = req.user.user._id;

    if (!userId) {
      return SendResponse(res, 400, false, "User not found");
    }

    const result = await Session.deleteMany({ userId });

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

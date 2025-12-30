import { SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const home = (req, res) => {
  const home = {
    message: "welcome to home page",
  };
  return SendResponse(res, 200, true, SUCCESS_MESSAGE.WELCOME_HOME, home);
};

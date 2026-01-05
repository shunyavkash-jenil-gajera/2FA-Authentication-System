import { SUCCESS_MESSAGE } from "../utils/constants.util.js";
import { SendResponse } from "../utils/sendResponse.util.js";

export const home = (req, res) => {
  const home = {
    message: "Welcome To Jenil's 2FA Authentication System Home Page",
  };
  return SendResponse(res, 200, true, SUCCESS_MESSAGE.WELCOME_HOME, home);
};

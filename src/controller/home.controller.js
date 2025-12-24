import { SendResponse } from "../utils/sendResponse.util.js";

export const home = (req, res) => {
  const home = {
    message: "welcome to home page",
  };
  return SendResponse(res, 200, true, "welcome home page", home);
};

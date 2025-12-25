import { SendResponse } from "../utils/sendResponse.util.js";

export const validationErrorHandler =
  (schema, property = "body") =>
  (req, res, next) => {
    const data = req[property];
    console.log(req.body, "req.body");

    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return SendResponse(res, 400, false, `Missing or empty ${property} data`);
    }

    const { error } = schema.validate(data);
    if (error) {
      return SendResponse(res, 422, false, error.details[0].message, error);
    }

    next();
  };

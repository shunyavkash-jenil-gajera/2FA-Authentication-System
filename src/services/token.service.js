import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRETE,
} from "../config/environment.config.js";

const generateAccessAndRefreshTokens = async ({ id, email }) => {
  const accessToken = jwt.sign({ id, email }, ACCESS_TOKEN_SECRETE, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  return { accessToken };
};

export { generateAccessAndRefreshTokens };

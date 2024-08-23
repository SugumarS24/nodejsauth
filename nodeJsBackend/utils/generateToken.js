import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/enVars.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("user-token", token, {
    maxAge: 24 * 1 * 60 * 60 * 1000, //1day in MS
    httpOnly: true, //prevent xss attacks cross-site scripting attacks,make it not be accessed by JS
    sameSite: "strict", //CSRF attacks cross-site request forgery attcks
    secure: ENV_VARS.NODE_ENV === "development",
  });
  return token;
};

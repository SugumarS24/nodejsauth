import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/enVars.js";
import { User } from "../models/user.model.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Missing token",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ENV_VARS.JWT_SECRET, async (err, decode) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findOne({ _id: decode.userId });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  });
};

export default verifyToken;

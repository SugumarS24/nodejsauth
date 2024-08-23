import express from "express";
import {
  currentUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/index.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUser", verifyToken, currentUser);

export default router;

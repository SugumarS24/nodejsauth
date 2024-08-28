import express from "express";
import {
  addUser,
  currentUser,
  login,
  logout,
  registerCompany,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/index.js";

const router = express.Router();

router.post("/register/user", addUser);
router.post("/register/company", registerCompany);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUser", verifyToken, currentUser);

export default router;

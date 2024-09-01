import express from "express";
import {
  addUser,
  currentUser,
  getAllCompanies,
  getAllUsers,
  login,
  logout,
  registerCompany,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/index.js";

const router = express.Router();

router.post("/register/user", addUser);
router.get("/user", verifyToken, getAllUsers);
router.post("/register/company", registerCompany);
router.get("/company", getAllCompanies);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUser", verifyToken, currentUser);

export default router;

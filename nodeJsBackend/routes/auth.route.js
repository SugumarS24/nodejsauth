import express from "express";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("signup is ready");
});

router.get("/login", (req, res) => {
  res.send("login is ready");
});

router.get("/logout", (req, res) => {
  res.send("logout is ready");
});

export default router;

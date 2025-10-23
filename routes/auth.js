const express = require("express");
const jwt = require("jsonwebtoken");
const { register, login, getUser, googleAuth } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { CLIENT_URL, JWT_SECRET } = require("../config");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", getUser);

router.get("/google", googleAuth);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
  });
  res.redirect(`${CLIENT_URL}/clients`);
});

module.exports = router;

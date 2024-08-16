const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const { JWT_SECRET } = require("../config");
const { login, register } = require("../controllers/userController");

router.post("/register", register);

router.post("/login", login);

router.get("/current_user", (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect('http://localhost:5173');
});

module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const UserModel = mongoose.model("UserModel");

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/clients');
  })

module.exports = router;
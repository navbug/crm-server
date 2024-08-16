const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const UserModel = mongoose.model("UserModel");
const UserModel = require("../models/user");
const { JWT_SECRET } = require("../config");

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ error: "Fill all required fields" });
    }

    const userInDB = await UserModel.findOne({ email: email });
    if (userInDB) {
      return res.status(500).json({ error: "User already registered" });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 8);
    console.log("register log");
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await user.save();
    res.status(201).json({ result: "User Registered!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Fill all required fields" });
    }

    const userInDB = await UserModel.findOne({ email: email });
    if (!userInDB) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const didMatch = await bcryptjs.compare(password, userInDB.password);
    if (didMatch) {
      const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
      const userInfo = {
        _id: userInDB._id,
        email: userInDB.email,
        name: userInDB.name,
        avatar: userInDB.avatar,
      };
      res.status(200).json({ result: { token: jwtToken, user: userInfo } });
    } else {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
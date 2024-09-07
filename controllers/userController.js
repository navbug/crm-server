const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { JWT_SECRET } = require("../config");
const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({ users });
  } catch (err) {
    console.log("Error getting all users: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    
    const user = await User.findById(userId).select("-password");

    res.status(200).json({user});
  } catch (err) {
    console.log("Error getting user details: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = req.body;

    const userUpdated = await User.findByIdAndUpdate(
      user._id,
      user,
    );

    if (!userUpdated) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ result: "User Info Updated!", user: userUpdated });
  } catch (err) {
    console.log("Error updating user: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete old avatar if it exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: "Avatar uploaded successfully", user });
  } catch (err) {
    console.log("Error uploading avatar: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
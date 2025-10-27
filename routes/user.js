const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { JWT_SECRET } = require("../config");
const { getUser, updateUser, uploadAvatar, getAllUsers } = require("../controllers/userController");

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get("/all", getAllUsers);
router.get("/:userId", getUser);
router.put("/:userId", updateUser);
router.post("/:userId/upload-avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;
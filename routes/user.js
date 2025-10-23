const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { JWT_SECRET } = require("../config");
const { getUser, updateUser, uploadAvatar, getAllUsers } = require("../controllers/userController");
const { storage } = require("../utils/cloudinary");

// Setup multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" || 
      file.mimetype === "image/jpg" || 
      file.mimetype === "image/jpeg" || 
      file.mimetype === "image/webp" || 
      file.mimetype === "image/svg+xml"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File types allowed are .jpeg, .png, .jpg, .webp, .svg"), false);
    }
  }
});

router.get("/all", getAllUsers);
router.get("/:userId", getUser);
router.put("/:userId", updateUser);
router.post("/:userId/upload-avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;
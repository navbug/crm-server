const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  getAllContent,
  addMessage,
  getMessage,
  updateMessage,
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  getFileSingle,
  getAllPages,
  getPage,
  addPage,
  deletePage,
  deleteMessage,
  updateFileData,
  updatePageData,
} = require("../controllers/contentController");

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/all", getAllContent);

//Message routes
router.post("/message", addMessage);
router.get("/message/:messageId", getMessage);
router.put("/message/:messageId", updateMessage);
router.delete("/message/:messageId", deleteMessage);

//File routes
router.get("/file/all", getFiles);
router.get("/file/:fileId", getFile);
router.post("/file/upload", upload.single("file"), uploadFile);
router.put("/file/:fileId", updateFileData);
router.get("/file/single/:filename", getFileSingle);
router.delete("/file/:fileId", deleteFile);

//Page routes
router.get("/page/all", getAllPages);
router.get("/page/:pageId", getPage);
router.post("/page", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'pdf', maxCount: 1 }]), addPage);
router.put("/page/:pageId", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'pdf', maxCount: 1 }]), updatePageData);
router.delete("/page/:pageId", deletePage);

module.exports = router;

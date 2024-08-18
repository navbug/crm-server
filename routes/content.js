const express = require("express");
const { getAllContent, addMessage } = require("../controllers/contentController");
const router = express.Router();

router.get("/all", getAllContent);

router.post("/message", addMessage);
// router.get("/:clientId", getClient);
// router.put("/:clientId", updateClient);

// router.post("/new", addClient);

module.exports = router;
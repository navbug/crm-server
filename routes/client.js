const express = require("express");
const { addClient, getAllClients, getClient, updateClient } = require("../controllers/clientController");
const router = express.Router();

router.get("/all", getAllClients);

router.get("/:clientId", getClient);
router.put("/:clientId", updateClient);

router.post("/new", addClient);

module.exports = router;
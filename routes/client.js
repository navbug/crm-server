const express = require("express");
const { addClient, getAllClients, getClient, updateClient, getClientsOfAllUsers, deleteClient } = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/allClients", protect, getClientsOfAllUsers);

router.get("/all", protect, getAllClients);
router.get("/:clientId", getClient);
router.put("/:clientId", updateClient);
router.post("/new", addClient);
router.delete("/:clientId", deleteClient);

module.exports = router;
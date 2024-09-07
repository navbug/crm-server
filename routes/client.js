const express = require("express");
const { addClient, getAllClients, getClient, updateClient, getClientsOfAllUsers, deleteClient } = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/allClients", protect, getClientsOfAllUsers);

router.get("/all", protect, getAllClients);
router.get("/:clientId", protect, getClient);
router.put("/:clientId", protect, updateClient);
router.post("/new", protect, addClient);
router.delete("/:clientId", protect, deleteClient);

module.exports = router;
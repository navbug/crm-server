const ClientModel = require("../models/client");

exports.getClientsOfAllUsers = async (req, res) => {
  try {
    const clients = await ClientModel.find({});

    res.status(200).json({clients});
  } catch (err) {
    console.error("Error getting clients: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await ClientModel.find({ user: req.user._id });

    res.status(200).json({clients});
  } catch (err) {
    console.error("Error getting clients: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.getClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    const client = await ClientModel.findById(clientId);

    res.status(200).json({client});
  } catch (err) {
    console.error("Error getting client details: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.addClient = async (req, res) => {
  try {
    const clientInfo = req.body;

    const clientExists = await ClientModel.findOne({
      phoneNumber: clientInfo.phoneNumber,
    });
    if (clientExists) {
      return res
        .status(500)
        .json({ error: "Client with the phone no. already exists." });
    }

    const client = new ClientModel(clientInfo);

    await client.save();
    res.status(201).json({ result: "Client Added!" });
  } catch (err) {
    console.error("Error adding client: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const clientInfo = req.body;

    const clientInfoUpdated = await ClientModel.findByIdAndUpdate(
      clientInfo._id,
      clientInfo,
    );

    if (!clientInfoUpdated) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.status(200).json({ result: "Client Info Updated!", client: clientInfoUpdated });
  } catch (err) {
    console.error("Error updating client: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const clientDeleted = await ClientModel.findByIdAndDelete(clientId);

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
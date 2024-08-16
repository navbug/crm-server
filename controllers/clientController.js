const ClientModel = require("../models/client");

exports.getAllClients = async (req, res) => {
  try {
    const clients = await ClientModel.find({});

    res.status(200).json({clients});
  } catch (err) {
    console.log("Error getting clients: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.getClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    console.log(clientId);
    
    const client = await ClientModel.findById(clientId);

    res.status(200).json({client});
  } catch (err) {
    console.log("Error getting client details: ", err);
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

    console.log("client add log", clientInfo);
    const client = new ClientModel(clientInfo);

    await client.save();
    res.status(201).json({ result: "Client Added!" });
  } catch (err) {
    console.log("Error adding client: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateClient = async (req, res) => {
  console.log("update client log", req.body);
  try {
    const clientInfo = req.body;

    const clientInfoUpdated = await ClientModel.findByIdAndUpdate(
      clientInfo._id,
      clientInfo,
      { new: true, runValidators: true }
    );

    if (!clientInfoUpdated) {
      return res.status(404).json({ error: "Client not found." });
    }

    console.log("client update log", clientInfoUpdated);

    res.status(200).json({ result: "Client Info Updated!", client: clientInfoUpdated });
  } catch (err) {
    console.log("Error updating client: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
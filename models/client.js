const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  displayName: String,
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  country: String,
  notes: String,
  groups: [
    {
      type: String,
    },
  ],
  activity: [
    {
      category: {
        type: String,
        required: true,
      },
      details: String,
      dateAndTime: {
        type: String,
        required: true,
      },
    },
  ],
  dateAdded: {
    type: String,
    default: Date.now,
  },
  lastActivity: {
    type: String,
  },
  contacted: {
    type: Boolean,
    default: false
  },
  followUp: {
    type: String,
    default: ""
  },
  user: String,
});

const ClientModel = mongoose.model("ClientModel", clientSchema);

module.exports = ClientModel;

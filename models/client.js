const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
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
    }
  ],
  activity: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityModel"
    }
  ],
  dateAdded: {
    type: String,
    default: Date.now()
  },
  lastActivity: {
    type: String,
  },
  contacted: Boolean,
});

const ClientModel = mongoose.model("ClientModel", activitySchema);

module.exports = ClientModel;
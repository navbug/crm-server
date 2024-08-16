const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  details: String,
  dateAndTime: {
    type: String,
    required: true,
  }
});

const ActivityModel = mongoose.model("ActivityModel", userSchema);

module.exports = ActivityModel;
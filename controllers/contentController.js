const ContentModel = require("../models/content");

exports.getAllContent = async (req, res) => {
  try {
    const content = await ContentModel.find({});

    res.status(200).json({content});
  } catch (err) {
    console.log("Error getting content: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const newMessage = req.body;
    let content = await ContentModel.findOne();
    content.messages.push(newMessage);

    await content.save();
    res.status(201).json({ result: "Message Added!" });
  } catch (err) {
    console.log("Error adding message: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
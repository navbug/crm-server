const path = require("path");
const ContentModel = require("../models/content");

exports.getAllContent = async (req, res) => {
  try {
    const content = await ContentModel.find({});

    res.status(200).json({ content });
  } catch (err) {
    console.log("Error getting content: ", err);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

const mongoose = require("mongoose");

exports.getMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    console.log(messageId);

    const result = await ContentModel.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages._id": new mongoose.Types.ObjectId(messageId) } },
      { $project: { message: "$messages" } },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    console.log(result[0].message);
    const message = result[0].message;
    res.status(200).json({ message });
  } catch (err) {
    console.log("Error getting message details: ", err);
    res.status(500).json({ error: "Internal Server Error" });
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

exports.updateMessage = async (req, res) => {
  try {
    // const messageId = req.params.messageId;
    const updateData = req.body;

    // console.log("Updating message:", messageId);
    console.log("Update data:", updateData);

    const result = await ContentModel.findOneAndUpdate(
      { "messages._id": new mongoose.Types.ObjectId(updateData._id) },
      { $set: { "messages.$": updateData } },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Message not found" });
    }

    const updatedMessage = result.messages.find(
      (msg) => msg._id.toString() === updateData._id
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Updated message not found" });
    }

    res
      .status(200)
      .json({ result: "Message Updated", message: updatedMessage });
  } catch (err) {
    console.log("Error updating message: ", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const result = await ContentModel.updateOne(
      {},
      { $pull: { messages: { _id: req.params.messageId } } }
    );

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  console.log(req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let activity = JSON.parse(req.body.activity);
    const fileLink = `/uploads/${req.file.filename}`;
    console.log(fileLink);

    const newFile = {
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      fileLink: fileLink,
      mimeType: req.file.mimetype,
      size: req.file.size,
      shared: 0,
      lastShared: null,
      created: req.body.created,
      lastUpdated: req.body.lastUpdated,
      activity: activity,
    };

    const content = await ContentModel.findOne();
    if (!content) {
      const newContent = new ContentModel({ files: [newFile] });
      await newContent.save();
    } else {
      content.files.push(newFile);
      await content.save();
    }

    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFile = async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  try {
    const fileId = req.params.id;

    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No content found" });
    }

    const fileIndex = content.files.findIndex(file => file._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found" });
    }

    let updatedFile = content.files[fileIndex];

    // Update file properties
    updatedFile.title = req.body.title || updatedFile.title;
    updatedFile.lastUpdated = req.body.lastUpdated;

    // Update activity
    if (req.body.activity) {
      let newActivity = JSON.parse(req.body.activity);
      updatedFile.activity = [...updatedFile.activity, ...newActivity];
    }

    // If a new file is uploaded, update file-related properties
    if (req.file) {
      const fileLink = `/uploads/${req.file.filename}`;
      updatedFile.filename = req.file.filename;
      updatedFile.fileLink = fileLink;
      updatedFile.mimeType = req.file.mimetype;
      updatedFile.size = req.file.size;
    }

    // Save the updated content
    await content.save();

    res.status(200).json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFileData = async (req, res) => {
  console.log("Updating file data" + req.body);
  try {
    const fileId = req.params.fileId;
    const {
      title,
      fileName,
      fileLink,
      mimeType,
      size,
      shared,
      lastShared,
      created,
      lastUpdated,
      activity,
      template
    } = req.body;

    let updateData = {
      title,
      fileName,
      fileLink,
      mimeType,
      size,
      shared,
      created,
      lastShared,
      lastUpdated,
      template,
    };

    if (activity) {
      try {
        updateData.activity = JSON.parse(activity);
      } catch (error) {
        console.error("Error parsing activity:", error);
        return res.status(400).json({ message: "Invalid activity data" });
      }
    }

    const result = await ContentModel.findOneAndUpdate(
      { "files._id": fileId },
      { $set: { "files.$": { ...updateData, _id: fileId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "File not found" });
    }

    const updatedFile = result.files.find(
      (file) => file._id.toString() === fileId
    );

    res.json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No files found" });
    }
    res.json(content.files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFile = async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No content found" });
    }

    const file = content.files.id(req.params.fileId);
    console.log(file);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFileSingle = async (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  console.log(filePath);
  res.sendFile(filePath);
};

exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const result = await ContentModel.updateOne(
      {},
      { $pull: { files: { _id: fileId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No pages found" });
    }
    res.json({ pages: content.pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No content found" });
    }

    const page = content.pages.id(req.params.pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ page });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addPage = async (req, res) => {
  try {
    const { title, description, websiteLink, created, lastUpdated } = req.body;
    let activity;
    try {
      activity = JSON.parse(req.body.activity);
    } catch (error) {
      console.error("Error parsing activity:", error);
      activity = [];
    }
    let images = [];
    if (req.files.images) {
      images = req.files.images.map((file) => `/uploads/${file.filename}`);
    }

    let pdfLink = null;
    if (req.files.pdf && req.files.pdf.length > 0) {
      pdfLink = `/uploads/${req.files.pdf[0].filename}`;
    }

    console.log(title, description, websiteLink);
    console.log(images, pdfLink);

    const newPage = {
      title,
      description,
      images,
      websiteLink,
      pdfLink,
      shared: 0,
      lastShared: "",
      created,
      lastUpdated,
      activity,
    };

    const content = await ContentModel.findOne();
    if (!content) {
      const newContent = new ContentModel({ pages: [newPage] });
      await newContent.save();
    } else {
      content.pages.push(newPage);
      await content.save();
    }

    res
      .status(201)
      .json({ message: "Page created successfully", page: newPage });
  } catch (error) {
    console.error("Error adding page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updatePageData = async (req, res) => {
  console.log("REQ body: " + req.body);
  try {
    const pageId = req.params.pageId;
    const {
      title,
      description,
      websiteLink,
      activity,
      created,
      lastUpdated,
      shared,
      lastShared,
      images,
      pdfLink,
      template,
    } = req.body;

    const updatePage = {
      title,
      description,
      images,
      websiteLink,
      pdfLink,
      created,
      shared,
      lastShared,
      lastUpdated,
      activity,
      template,
    };

    if (activity) {
      try {
        updatePage.activity = JSON.parse(activity);
      } catch (error) {
        console.error("Error parsing activity:", error);
        return res.status(400).json({ message: "Invalid activity data" });
      }
    }

    console.log("UPDATED page: " + updatePage);

    const result = await ContentModel.findOneAndUpdate(
      { "pages._id": pageId },
      { $set: { "pages.$": { ...updatePage, _id: pageId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Page not found" });
    }

    const updatedPageData = result.pages.find(
      (page) => page._id.toString() === pageId
    );

    res.json({ message: "Page updated successfully", page: updatedPageData });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const result = await ContentModel.updateOne(
      {},
      { $pull: { pages: { _id: req.params.pageId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

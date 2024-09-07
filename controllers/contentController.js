const mongoose = require("mongoose");
const path = require("path");
const fs = require('fs');
const ContentModel = require("../models/content");

exports.getMessages = async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No messages found" });
    }
    res.json(content.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    if (!content) {
      return res.status(404).json({ message: "No content found" });
    }

    const message = content.messages.id(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    console.error("Error adding message: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const updateData = req.body;

    const result = await ContentModel.findOneAndUpdate(
      { "messages._id": messageId },
      { $set: { "messages.$": { ...updateData, _id: messageId } } },
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
    console.error("Error updating message: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const result = await ContentModel.updateOne(
      {},
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let activity = JSON.parse(req.body.activity);
    const fileLink = `/uploads/${req.file.filename}`;

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
  try {
    const fileId = req.params.fileId;
    const { title, fileName, fileLink, mimeType, size, shared, lastShared, created, lastUpdated, activity, template } = req.body;

    let updateData = { title, fileName, fileLink, mimeType, size, shared, created, lastShared, lastUpdated, template };

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

  res.sendFile(filePath);
};

exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Find the file document first
    const content = await ContentModel.findOne({ "files._id": fileId });
    if (!content) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = content.files.find(f => f._id.toString() === fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, '..', file.fileLink);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the file from the database
    const result = await ContentModel.updateOne(
      {},
      { $pull: { files: { _id: fileId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "File not found in database" });
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

    const newPage = { title, description, images, websiteLink, pdfLink, shared: 0, lastShared: "", created, lastUpdated, activity };

    const content = await ContentModel.findOne();
    if (!content) {
      const newContent = new ContentModel({ pages: [newPage] });
      await newContent.save();
    } else {
      content.pages.push(newPage);
      await content.save();
    }

    res.status(201).json({ message: "Page created successfully", page: newPage });
  } catch (error) {
    console.error("Error adding page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updatePageData = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const { title, description, websiteLink, activity, created, lastUpdated, shared, lastShared, images, pdfLink, template } = req.body;

    const updatePage = { title, description, images, websiteLink, pdfLink, created, shared, lastShared, lastUpdated, activity, template };

    if (activity) {
      try {
        updatePage.activity = JSON.parse(activity);
      } catch (error) {
        console.error("Error parsing activity:", error);
        return res.status(400).json({ message: "Invalid activity data" });
      }
    }

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
    const pageId = req.params.pageId;

    // Find the page document first
    const content = await ContentModel.findOne({ "pages._id": pageId });
    if (!content) {
      return res.status(404).json({ message: "Page not found" });
    }

    const page = content.pages.find(p => p._id.toString() === pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Delete associated images
    if (page.images && page.images.length > 0) {
      page.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    // Delete associated PDF file
    if (page.pdfLink) {
      const pdfPath = path.join(__dirname, '..', page.pdfLink);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    // Remove the page from the database
    const result = await ContentModel.updateOne(
      {},
      { $pull: { pages: { _id: pageId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Page not found in database" });
    }

    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
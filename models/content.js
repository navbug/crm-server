const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  messages: [
    {
      title: {
        type: String,
        required: true,
      },
      template: {
        type: String,
        required: true,
      },
      sent: Number,
      lastSent: String,
      created: String,
      lastUpdated: String,
      activity: [
        {
          details: {
            type: String,
            required: true,
          },
          dateAndTime: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  files: [
    {
      title: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        // required: true,
      },
      fileLink: {
        type: String,
        // required: true,
      },
      mimeType: {
        type: String,
        // required: true,
      },
      size: {
        type: Number,
        // required: true,
      },
      template: {
        type: String,
        default: `Hi @clientName, \nHere's the link to view file:`,
      },
      shared: {
        type: Number,
        default: 0,
      },
      lastShared: String,
      created: String,
      lastUpdated: String,
      activity: [
        {
          details: {
            type: String,
            required: true,
          },
          dateAndTime: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  pages: [
    {
      title: String,
      description: String,
      images: [String],
      websiteLink: String,
      pdfLink: String,
      template: {
        type: String,
        default: `Hi @clientName, \nHere are the details for the page:`,
      },
      shared: {
        type: Number,
        default: 0,
      },
      lastShared: String,
      created: String,
      lastUpdated: String,
      activity: [
        {
          details: {
            type: String,
            required: true,
          },
          dateAndTime: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const ContentModel = mongoose.model("ContentModel", contentSchema);

module.exports = ContentModel;

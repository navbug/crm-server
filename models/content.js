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
  // files: [
  //   {
  //     title: {
  //       type: String,
  //       required: true,
  //     },
  //     template: {
  //       type: String,
  //       default: `Hi @clientName, \n Here's the link to view file:`
  //     },
  //     shared: Number,
  //     lastShared: String,
  //     activity: [
  //       {
  //         details: {
  //           type: String,
  //           required: true,
  //         },
  //         dateAndTime: {
  //           type: String,
  //           required: true,
  //         },
  //       },
  //     ],
  //   },
  // ],
  // pages: []
});

const ContentModel = mongoose.model("ContentModel", contentSchema);

module.exports = ContentModel;

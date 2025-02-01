const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  isDeleted: {
    type: Boolean,
    default: false,
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: [
    {
      url: {
        type: String, // URL of the image
        required: true,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  type: {
    type: String,
    trim: true,
  },
  parts: {
    type: String,
    trim: true,
  },
  approvalNeeded: {
    type: Boolean,
    default: false,
  },
  links: [
    {
      type: String, // Assuming links are stored as URLs
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;

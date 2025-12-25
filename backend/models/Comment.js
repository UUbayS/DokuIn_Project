// backend/models/Comment.js

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  // Dokumen yang dikomentari
  dokumenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dokumen",
    required: true,
  },
  // User yang membuat komentar
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Isi komentar
  isi: {
    type: String,
    required: true,
  },
  // Parent comment untuk reply (opsional)
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);

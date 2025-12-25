// backend/routes/comments.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getCommentsByDokumen,
  addComment,
  deleteComment,
} = require("../controllers/commentController");

/**
 * @route   GET api/comments/:dokumenId
 * @desc    Ambil semua komentar untuk satu dokumen
 * @access  Private
 */
router.get("/:dokumenId", auth, getCommentsByDokumen);

/**
 * @route   POST api/comments/:dokumenId
 * @desc    Tambah komentar baru ke dokumen
 * @access  Private
 */
router.post("/:dokumenId", auth, addComment);

/**
 * @route   DELETE api/comments/:commentId
 * @desc    Hapus komentar
 * @access  Private
 */
router.delete("/:commentId", auth, deleteComment);

module.exports = router;

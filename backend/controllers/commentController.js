// backend/controllers/commentController.js

const Comment = require("../models/Comment");
const Dokumen = require("../models/Dokumen");

/**
 * @route   GET api/comments/:dokumenId
 * @desc    Ambil semua komentar untuk satu dokumen
 * @access  Private
 */
exports.getCommentsByDokumen = async (req, res) => {
  try {
    const comments = await Comment.find({ dokumenId: req.params.dokumenId })
      .populate("userId", "namaPengguna role")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @route   POST api/comments/:dokumenId
 * @desc    Tambah komentar baru ke dokumen
 * @access  Private (Admin bisa semua, Karyawan hanya dokumen sendiri)
 */
exports.addComment = async (req, res) => {
  try {
    const { isi, parentId } = req.body;
    const dokumenId = req.params.dokumenId;

    if (!isi || isi.trim() === "") {
      return res.status(400).json({ msg: "Isi komentar tidak boleh kosong" });
    }

    // Cek dokumen ada
    const dokumen = await Dokumen.findById(dokumenId);
    if (!dokumen) {
      return res.status(404).json({ msg: "Dokumen tidak ditemukan" });
    }

    // Cek otorisasi: Admin bisa comment di semua, Karyawan hanya di dokumennya sendiri
    if (req.user.role !== "Administrator") {
      if (dokumen.karyawanId.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Anda hanya bisa berkomentar di dokumen Anda sendiri" });
      }
    }

    // Buat komentar baru
    const newComment = new Comment({
      dokumenId: dokumenId,
      userId: req.user.id,
      isi: isi.trim(),
      parentId: parentId || null,
    });

    const comment = await newComment.save();

    // Populate user info sebelum return
    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "namaPengguna role");

    res.status(201).json(populatedComment);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Dokumen tidak ditemukan" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @route   DELETE api/comments/:commentId
 * @desc    Hapus komentar (hanya pemilik komentar atau admin)
 * @access  Private
 */
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: "Komentar tidak ditemukan" });
    }

    // Cek otorisasi: hanya pemilik atau admin yang bisa hapus
    if (comment.userId.toString() !== req.user.id && req.user.role !== "Administrator") {
      return res.status(403).json({ msg: "Anda tidak berhak menghapus komentar ini" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ msg: "Komentar berhasil dihapus" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Komentar tidak ditemukan" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

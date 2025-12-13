// backend/routes/dokumen.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // "Penjaga" kita
const upload = require("../middleware/upload"); // Middleware Multer
const { uploadDokumen, getMyDokumen, getDokumenById } = require("../controllers/dokumenController");


/**
 * @route   POST api/dokumen/upload
 * @desc    Upload dokumen (Use Case #5) [cite: 157]
 * @access  Private (Hanya Karyawan)
 */
router.post(
  "/upload",
  [
    auth, // 1. Cek apakah user login
    upload.single("file"), // 2. Ambil 1 file dari field yg bernama 'file'
  ],
  uploadDokumen
);
router.get("/my-dokumen", auth, getMyDokumen); // 'auth' memproteksi rute ini


module.exports = router;

/**
 * @route   GET api/dokumen/:id
 * @desc    Ambil detail satu dokumen berdasarkan ID (BARU)
 * @access  Private (membutuhkan auth)
 */
router.get("/:id", auth, getDokumenById); // <-- RUTE BARU DITAMBAHKAN

module.exports = router;

// backend/routes/dokumen.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // "Penjaga" kita
const adminMiddleware = require("../middleware/adminMiddleware"); // Admin only
const upload = require("../middleware/upload"); // Middleware Multer
const { 
  uploadDokumen, 
  getMyDokumen, 
  getDokumenById, 
  downloadDokumen,
  getAllDokumen,
  updateStatusDokumen
} = require("../controllers/dokumenController");


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

/**
 * @route   GET api/dokumen/my-dokumen
 * @desc    Ambil dokumen milik user yang sedang login
 * @access  Private
 */
router.get("/my-dokumen", auth, getMyDokumen);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET api/dokumen/admin/all
 * @desc    Ambil semua dokumen dari semua karyawan (Admin Only)
 * @access  Private (Admin)
 */
router.get("/admin/all", [auth, adminMiddleware], getAllDokumen);

/**
 * @route   PUT api/dokumen/admin/status/:id
 * @desc    Update status dokumen (Disetujui/Ditolak) - Admin Only
 * @access  Private (Admin)
 */
router.put("/admin/status/:id", [auth, adminMiddleware], updateStatusDokumen);

// ==================== END ADMIN ROUTES ====================

/**
 * @route   GET api/dokumen/:id
 * @desc    Ambil detail satu dokumen berdasarkan ID
 * @access  Private (membutuhkan auth)
 */
router.get("/:id", auth, getDokumenById);

/**
 * @route   GET api/dokumen/download/:id
 * @desc    Download file berdasarkan ID dokumen
 * @access  Private
 */
router.get("/download/:id", auth, downloadDokumen);

module.exports = router;

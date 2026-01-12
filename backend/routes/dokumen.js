// backend/routes/dokumen.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // "Penjaga" kita
const adminMiddleware = require("../middleware/adminMiddleware"); // Super Admin only
const roleMiddleware = require("../middleware/roleMiddleware"); // Role-based access
const upload = require("../middleware/upload"); // Middleware Multer
const { 
  uploadDokumen, 
  getMyDokumen, 
  getDokumenById, 
  downloadDokumen,
  getAllDokumen,
  updateStatusDokumen,
  getDokumenByRole,
  updateStatusByRole
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

// ==================== MANAGER ROUTES (HRD & OPERASIONAL MANAJER) ====================

/**
 * @route   GET api/dokumen/manager/all
 * @desc    Ambil dokumen berdasarkan role (Super Admin, HRD, Operasional Manajer)
 * @access  Private (Manager roles)
 */
router.get(
  "/manager/all",
  [auth, roleMiddleware("Super Admin", "HRD", "Operasional Manajer")],
  getDokumenByRole
);

/**
 * @route   PUT api/dokumen/manager/status/:id
 * @desc    Update status dokumen - HRD/Op. Manajer hanya bisa update dokumen sesuai jenisnya
 * @access  Private (Manager roles)
 */
router.put(
  "/manager/status/:id",
  [auth, roleMiddleware("Super Admin", "HRD", "Operasional Manajer")],
  updateStatusByRole
);

// ==================== ADMIN ROUTES (SUPER ADMIN ONLY) ====================

/**
 * @route   GET api/dokumen/admin/all
 * @desc    Ambil semua dokumen dari semua karyawan (Super Admin Only)
 * @access  Private (Super Admin)
 */
router.get("/admin/all", [auth, adminMiddleware], getAllDokumen);

/**
 * @route   PUT api/dokumen/admin/status/:id
 * @desc    Update status dokumen (Disetujui/Ditolak) - Super Admin Only
 * @access  Private (Super Admin)
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


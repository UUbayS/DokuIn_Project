// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Kita akan buat controllernya di file terpisah

const { registerUser, loginUser } = require("../controllers/authController");

/**
 * @route   POST api/auth/register
 * @desc    Mendaftarkan pengguna baru - ADMIN ONLY
 * @access  Private (Admin)
 */
router.post("/register", [auth, adminMiddleware], registerUser);

// Nanti kita akan tambahkan rute login di sini
// router.post('/login', loginUser);

router.post("/login", loginUser);

module.exports = router;

// backend/routes/auth.js

const express = require("express");
const router = express.Router();

// Kita akan buat controllernya di file terpisah
const { registerUser } = require("../controllers/authController");

/**
 * @route   POST api/auth/register
 * @desc    Mendaftarkan pengguna baru (Use Case #1) [cite: 157]
 * @access  Public
 */
router.post("/register", registerUser);

// Nanti kita akan tambahkan rute login di sini
// router.post('/login', loginUser);

module.exports = router;

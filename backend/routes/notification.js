const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Pastikan path middleware auth benar
const notificationController = require('../controllers/notificationController');

// Semua route di sini perlu otentikasi
router.use(auth);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;

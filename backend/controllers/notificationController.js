const Notification = require("../models/Notification");

/**
 * @route   GET api/notifications
 * @desc    Ambil semua notifikasi untuk user yang login
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 }); // Terbaru paling atas
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @route   PUT api/notifications/:id/read
 * @desc    Tandai notifikasi sebagai sudah dibaca
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: "Notifikasi tidak ditemukan" });
    }

    // Pastikan notifikasi milik user yang login
    if (notification.recipientId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Internal function to create notification
 * @param {string} recipientId - User ID penerima
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe: APPROVED, REJECTED, NEW_DOCUMENT, NEW_COMMENT
 * @param {string} documentId - ID Dokumen terkait (opsional)
 */
exports.createNotification = async (recipientId, message, type, documentId = null) => {
  try {
    const newNotification = new Notification({
      recipientId,
      message,
      type,
      documentId
    });
    await newNotification.save();
  } catch (err) {
    console.error("Gagal membuat notifikasi:", err.message);
  }
};

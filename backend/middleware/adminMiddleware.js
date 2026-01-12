// backend/middleware/adminMiddleware.js
// Middleware untuk memastikan hanya Super Admin yang bisa mengakses

module.exports = function (req, res, next) {
  // req.user sudah di-set oleh authMiddleware sebelumnya
  if (!req.user) {
    return res.status(401).json({ msg: "Tidak ada token, otorisasi ditolak" });
  }

  // Cek role
  if (req.user.role !== "Super Admin") {
    return res.status(403).json({ msg: "Akses ditolak. Hanya Super Admin yang diizinkan." });
  }

  next();
};

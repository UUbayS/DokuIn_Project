// backend/middleware/adminMiddleware.js
// Middleware untuk memastikan hanya Administrator yang bisa mengakses

module.exports = function (req, res, next) {
  // req.user sudah di-set oleh authMiddleware sebelumnya
  if (!req.user) {
    return res.status(401).json({ msg: "Tidak ada token, otorisasi ditolak" });
  }

  // Cek role
  if (req.user.role !== "Administrator") {
    return res.status(403).json({ msg: "Akses ditolak. Hanya Administrator yang diizinkan." });
  }

  next();
};

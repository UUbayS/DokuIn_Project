// backend/middleware/roleMiddleware.js
// Middleware untuk cek apakah user memiliki salah satu role yang diizinkan

module.exports = function (...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ msg: "Tidak ada token, otorisasi ditolak" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Akses ditolak. Role yang diizinkan: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

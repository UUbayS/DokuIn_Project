// backend/models/User.js

const mongoose = require("mongoose");

// Schema ini didasarkan pada diagram kelas PenggunaModel [cite: 722-727, 1040-1049]
const UserSchema = new mongoose.Schema(
  {
    namaPengguna: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    kataSandi: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // Dokumen SKPL/DPPL menyebutkan 2 aktor utama: Karyawan dan Administrator
      enum: ["Karyawan", "Administrator"],
      default: "Karyawan",
    },
    // Atribut tambahan dari diagram kelas [cite: 726, 1044-1046]
    nomorTelepon: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    fotoProfil: {
      type: String,
    },
  },
  {
    // Otomatis membuat field createdAt dan updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

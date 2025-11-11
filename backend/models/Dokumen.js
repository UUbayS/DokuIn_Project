// backend/models/Dokumen.js

const mongoose = require("mongoose");

// Skema ini didasarkan pada Class Diagram DokumenModel
const DokumenSchema = new mongoose.Schema({
  // karyawanId akan ditambahkan untuk melacak siapa peng-upload
  karyawanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Merujuk ke model User
    required: true,
  },
  judul: {
    type: String, // 'String judul' [cite: 1026]
    required: true,
  },
  status: {
    type: String, // 'String status' [cite: 1029]
    default: "Menunggu Persetujuan",
  },
  tanggalUnggah: {
    type: Date, // 'DateTime tanggalUnggah' [cite: 1028]
    default: Date.now,
  },
  // Kita tidak menyimpan file-nya di DB, tapi 'path' lokasinya
  filePath: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String, // 'String deskripsi' [cite: 1027]
  },
  // 'File konten' [cite: 1030] direpresentasikan oleh filePath
});

module.exports = mongoose.model("Dokumen", DokumenSchema);

// backend/controllers/dokumenController.js

const Dokumen = require("../models/Dokumen");

exports.uploadDokumen = async (req, res) => {
  try {
    const { judul, jenisDokumen } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: "File tidak ditemukan atau format salah" });
    }

    if (!jenisDokumen) {
      return res.status(400).json({ msg: "Jenis dokumen wajib diisi" });
    }

    const newDokumen = new Dokumen({
      judul: judul,
      jenisDokumen: jenisDokumen,
      filePath: req.file.path.replace(/\\/g, "/"),
      deskripsi: req.body.deskripsi,
      karyawanId: req.user.id, 
    });

    const dokumen = await newDokumen.save();
    res.status(201).json({ msg: "Dokumen berhasil di-upload", dokumen });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// backend/controllers/dokumenController.js


exports.getMyDokumen = async (req, res) => {
  try {
    // req.user.id didapat dari middleware auth
    const dokumen = await Dokumen.find({ karyawanId: req.user.id }).sort({ tanggalUnggah: -1 }); // Urutkan dari terbaru

    res.json(dokumen);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @route   GET api/dokumen/:id
 * @desc    Ambil detail satu dokumen berdasarkan ID (BARU)
 * @access  Private (Hanya Karyawan pemilik/Admin)
 */
exports.getDokumenById = async (req, res) => {
    try {
        const dokumen = await Dokumen.findById(req.params.id);

        if (!dokumen) {
            return res.status(404).json({ msg: 'Dokumen tidak ditemukan' });
        }

        // Opsional: Cek otorisasi di sini (misalnya, hanya pemilik atau Admin yang boleh melihat)
        // if (dokumen.karyawanId.toString() !== req.user.id && req.user.role !== 'Administrator') {
        //     return res.status(403).json({ msg: 'Akses ditolak' });
        // }

        res.json(dokumen);
    } catch (err) {
        // Jika ID tidak valid (misalnya, bukan format MongoDB ObjectId), findById akan error
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Dokumen tidak ditemukan' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const path = require('path');
const fs = require('fs'); 

/**
 * @route   GET api/dokumen/download/:id
 * @desc    Download file berdasarkan ID dokumen
 * @access  Private/Public (Sesuaikan kebutuhan)
 */
exports.downloadDokumen = async (req, res) => {
  try {
    const dokumen = await Dokumen.findById(req.params.id);

    if (!dokumen) {
      return res.status(404).json({ msg: 'Dokumen tidak ditemukan di database' });
    }

    const fullPath = path.join(__dirname, '..', dokumen.filePath); 

    // Cek apakah file fisik benar-benar ada
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ msg: 'File fisik tidak ditemukan di server' });
    }

    // Perintahkan browser untuk download
    res.download(fullPath, dokumen.judul + path.extname(dokumen.filePath)); // Rename file sesuai judul saat didownload

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saat download');
  }
};

// ==================== ADMIN FUNCTIONS ====================

/**
 * @route   GET api/dokumen/admin/all
 * @desc    Ambil semua dokumen dari semua karyawan (Admin Only)
 * @access  Private (Admin)
 */
exports.getAllDokumen = async (req, res) => {
  try {
    // Ambil semua dokumen dan populate info karyawan
    const dokumen = await Dokumen.find()
      .populate('karyawanId', 'namaPengguna email')
      .sort({ tanggalUnggah: -1 });

    res.json(dokumen);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @route   PUT api/dokumen/admin/status/:id
 * @desc    Update status dokumen (Disetujui/Ditolak) - Admin Only
 * @access  Private (Admin)
 */
exports.updateStatusDokumen = async (req, res) => {
  try {
    const { status } = req.body;

    // Validasi status
    const validStatuses = ['Disetujui', 'Ditolak', 'Menunggu Persetujuan'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Status tidak valid. Gunakan: Disetujui, Ditolak, atau Menunggu Persetujuan' });
    }

    // Cari dan update dokumen
    const dokumen = await Dokumen.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true } // Return dokumen yang sudah diupdate
    ).populate('karyawanId', 'namaPengguna email');

    if (!dokumen) {
      return res.status(404).json({ msg: 'Dokumen tidak ditemukan' });
    }

    res.json({ msg: `Status dokumen berhasil diubah menjadi "${status}"`, dokumen });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Dokumen tidak ditemukan' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
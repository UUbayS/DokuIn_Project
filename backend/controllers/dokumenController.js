// backend/controllers/dokumenController.js

const Dokumen = require("../models/Dokumen");

exports.uploadDokumen = async (req, res) => {
  try {
    const { judul } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: "File tidak ditemukan atau format salah" });
    }


    const newDokumen = new Dokumen({
      judul: judul,
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
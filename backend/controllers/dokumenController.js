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

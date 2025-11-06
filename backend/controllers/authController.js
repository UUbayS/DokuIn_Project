const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

exports.registerUser = async (req, res) => {
  const { namaPengguna, email, kataSandi } = req.body;

  try {
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    let userByNama = await User.findOne({ namaPengguna });
    if (userByNama) {
      return res.status(400).json({ msg: "Nama pengguna sudah digunakan" });
    }

    let user = new User({
      namaPengguna,
      email,
      kataSandi,
    });

    const salt = await bcrypt.genSalt(10);
    user.kataSandi = await bcrypt.hash(kataSandi, salt);

    await user.save();

    res.status(201).json({ msg: "Registrasi berhasil. Akun Anda sedang menunggu verifikasi Admin." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.loginUser = async (req, res) => {
  // Skenario Utama 1: User memasukkan username dan password
  // Kita gunakan 'namaPengguna' sesuai UI Design [cite: 513, 516]
  const { namaPengguna, kataSandi } = req.body;

  try {
    // Skenario Utama 2: Sistem mengecek kredensial
    let user = await User.findOne({ namaPengguna });

    // Skenario Eksepsional: Jika kredensial tidak sesuai
    if (!user) {
      return res.status(400).json({ msg: "Kredensial salah (user)" });
    }

    // Cek password
    const isMatch = await bcrypt.compare(kataSandi, user.kataSandi);

    // Skenario Eksepsional: Jika kredensial tidak sesuai
    if (!isMatch) {
      return res.status(400).json({ msg: "Kredensial salah (pass)" });
    }

    // Skenario Utama 3: Sistem memberikan akses (JWT)
    // Buat token payload
    const payload = {
      user: {
        id: user.id,
        role: user.role, // Menyimpan role (Karyawan/Administrator) di token
      },
    };

    // Buat dan kirim token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600, // Token berlaku 1 jam (dalam detik)
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Kirim token ke frontend
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
tes
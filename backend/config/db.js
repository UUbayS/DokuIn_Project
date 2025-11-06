const mongoose = require("mongoose");
require("dotenv").config(); // Memuat variabel dari .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Terhubung...");
  } catch (err) {
    console.error(err.message);
    // Keluar dari proses jika gagal terhubung
    process.exit(1);
  }
};

module.exports = connectDB;

// backend/seedAdmin.js
// Script untuk membuat akun Administrator pertama
// Jalankan dengan: node seedAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    // Cek apakah sudah ada admin
    const existingAdmin = await User.findOne({ role: "Administrator" });
    if (existingAdmin) {
      console.log("❌ Sudah ada akun Administrator:");
      console.log(`   Username: ${existingAdmin.namaPengguna}`);
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Data admin default - GANTI PASSWORD SETELAH LOGIN PERTAMA!
    const adminData = {
      namaPengguna: "admin",
      email: "admin@dokuin.com",
      kataSandi: "admin123", // Password default
      role: "Administrator",
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.kataSandi = await bcrypt.hash(adminData.kataSandi, salt);

    // Buat user admin
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Akun Administrator berhasil dibuat!");
    console.log("================================");
    console.log(`   Username : admin`);
    console.log(`   Password : admin123`);
    console.log("================================");
    console.log("⚠️  PENTING: Ganti password setelah login pertama!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();

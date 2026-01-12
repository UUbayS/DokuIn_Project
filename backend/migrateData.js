// backend/migrateData.js
// Script untuk migrasi data lama ke format baru
// Jalankan dengan: node migrateData.js

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const migrateData = async () => {
  try {
    await connectDB();
    console.log("🔄 Memulai migrasi data...\n");

    // Gunakan native MongoDB collection untuk bypass Mongoose validation
    const db = mongoose.connection.db;
    const dokumenCollection = db.collection("dokumens");
    const userCollection = db.collection("users");

    // 1. Migrasi jenisDokumen: "Surat" -> "Surat Ijin"
    const suratResult = await dokumenCollection.updateMany(
      { jenisDokumen: "Surat" },
      { $set: { jenisDokumen: "Surat Ijin" } }
    );
    if (suratResult.modifiedCount > 0) {
      console.log(`✅ ${suratResult.modifiedCount} dokumen "Surat" diubah menjadi "Surat Ijin"`);
    } else {
      console.log("ℹ️  Tidak ada dokumen dengan jenisDokumen 'Surat'");
    }

    // 2. Migrasi jenisDokumen: "Lainnya" -> "Pribadi"
    const lainnyaResult = await dokumenCollection.updateMany(
      { jenisDokumen: "Lainnya" },
      { $set: { jenisDokumen: "Pribadi" } }
    );
    if (lainnyaResult.modifiedCount > 0) {
      console.log(`✅ ${lainnyaResult.modifiedCount} dokumen "Lainnya" diubah menjadi "Pribadi"`);
    } else {
      console.log("ℹ️  Tidak ada dokumen dengan jenisDokumen 'Lainnya'");
    }

    // 3. Migrasi role: "Administrator" -> "Super Admin"
    const adminResult = await userCollection.updateMany(
      { role: "Administrator" },
      { $set: { role: "Super Admin" } }
    );
    if (adminResult.modifiedCount > 0) {
      console.log(`✅ ${adminResult.modifiedCount} user "Administrator" diubah menjadi "Super Admin"`);
    } else {
      console.log("ℹ️  Tidak ada user dengan role 'Administrator'");
    }

    console.log("\n🎉 Migrasi data selesai!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

migrateData();

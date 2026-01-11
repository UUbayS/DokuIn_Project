// frontend/src/pages/admin/KelolaKaryawan.jsx
// Halaman untuk Admin mendaftarkan karyawan baru

import React, { useState } from "react";
import axios from "axios";
import { HiUserAdd, HiCheckCircle, HiXCircle } from "react-icons/hi";

const KelolaKaryawan = () => {
  const [formData, setFormData] = useState({
    namaPengguna: "",
    email: "",
    kataSandi: "",
    konfirmasiSandi: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { namaPengguna, email, kataSandi, konfirmasiSandi } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validasi
    if (!namaPengguna) {
      setMessage({ type: "error", text: "Nama Pengguna wajib diisi!" });
      return;
    }

    if (!email) {
      setMessage({ type: "error", text: "Email wajib diisi!" });
      return;
    }

    if (!kataSandi) {
      setMessage({ type: "error", text: "Kata Sandi wajib diisi!" });
      return;
    }

    if (kataSandi.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter!" });
      return;
    }

    if (kataSandi !== konfirmasiSandi) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok!" });
      return;
    }

    setIsLoading(true);

    try {
      // axios sudah punya default header x-auth-token dari AuthContext
      await axios.post("/api/auth/register", { namaPengguna, email, kataSandi });

      setMessage({
        type: "success",
        text: `Karyawan "${namaPengguna}" berhasil didaftarkan!`,
      });

      // Reset form
      setFormData({
        namaPengguna: "",
        email: "",
        kataSandi: "",
        konfirmasiSandi: "",
      });
    } catch (err) {
      console.error("Error registering:", err);
      const errorMsg = err.response?.data?.msg || "Terjadi kesalahan saat mendaftarkan karyawan";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#374151"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <HiUserAdd size={28} />
        Daftarkan Karyawan Baru
      </h1>

      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
        padding: "30px",
        maxWidth: "500px"
      }}>
        {message.text && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            background: message.type === "success" ? "#d1fae5" : "#fee2e2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#a7f0c9" : "#f5c6c6"}`
          }}>
            {message.type === "success" ? <HiCheckCircle size={20} /> : <HiXCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle} htmlFor="namaPengguna">Nama Pengguna</label>
            <input
              type="text"
              id="namaPengguna"
              name="namaPengguna"
              value={namaPengguna}
              onChange={handleChange}
              placeholder="Masukkan nama pengguna"
              disabled={isLoading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Masukkan email karyawan"
              disabled={isLoading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle} htmlFor="kataSandi">Password</label>
            <input
              type="password"
              id="kataSandi"
              name="kataSandi"
              value={kataSandi}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              disabled={isLoading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle} htmlFor="konfirmasiSandi">Konfirmasi Password</label>
            <input
              type="password"
              id="konfirmasiSandi"
              name="konfirmasiSandi"
              value={konfirmasiSandi}
              onChange={handleChange}
              placeholder="Ulangi password"
              disabled={isLoading}
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Mendaftarkan..." : "Daftarkan Karyawan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KelolaKaryawan;

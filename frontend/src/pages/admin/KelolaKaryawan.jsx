// frontend/src/pages/admin/KelolaKaryawan.jsx
// Halaman untuk Admin mendaftarkan karyawan baru

import React, { useState } from "react";
import axios from "axios";
import "./KelolaKaryawan.css";
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
    // Clear message when user starts typing
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!namaPengguna.trim()) {
      setMessage({ type: "error", text: "Nama Pengguna wajib diisi!" });
      return false;
    }

    if (!email.trim()) {
      setMessage({ type: "error", text: "Email wajib diisi!" });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Format email tidak valid!" });
      return false;
    }

    if (!kataSandi) {
      setMessage({ type: "error", text: "Kata Sandi wajib diisi!" });
      return false;
    }

    if (kataSandi.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter!" });
      return false;
    }

    if (kataSandi !== konfirmasiSandi) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok!" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/auth/register", { 
        namaPengguna: namaPengguna.trim(), 
        email: email.trim(), 
        kataSandi 
      });

      setMessage({
        type: "success",
        text: `Karyawan "${namaPengguna}" berhasil didaftarkan!`,
      });

      // Reset form after successful registration
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

  return (
    <div className="kelola-karyawan-container">
      {/* Page Header */}
      <h1 className="page-header">
        <HiUserAdd size={28} />
        Daftarkan Karyawan Baru
      </h1>

      {/* Form Card */}
      <div className="form-card">
        {/* Message Alert */}
        {message.text && (
          <div className={`message-alert ${message.type}`}>
            {message.type === "success" ? (
              <HiCheckCircle size={20} />
            ) : (
              <HiXCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Nama Pengguna */}
          <div className="form-group">
            <label className="form-label" htmlFor="namaPengguna">
              Nama Pengguna
            </label>
            <input
              type="text"
              id="namaPengguna"
              name="namaPengguna"
              value={namaPengguna}
              onChange={handleChange}
              placeholder="Masukkan nama pengguna"
              disabled={isLoading}
              className="form-input"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Masukkan email karyawan"
              disabled={isLoading}
              className="form-input"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="kataSandi">
              Password
            </label>
            <input
              type="password"
              id="kataSandi"
              name="kataSandi"
              value={kataSandi}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              disabled={isLoading}
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          {/* Konfirmasi Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="konfirmasiSandi">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="konfirmasiSandi"
              name="konfirmasiSandi"
              value={konfirmasiSandi}
              onChange={handleChange}
              placeholder="Ulangi password"
              disabled={isLoading}
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? "Mendaftarkan..." : "Daftarkan Karyawan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KelolaKaryawan;
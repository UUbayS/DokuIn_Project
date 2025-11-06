// frontend/src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import hook kita

const Login = () => {
  const { login } = useAuth(); // Gunakan fungsi login dari Context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaPengguna: "",
    kataSandi: "",
  });
  const [message, setMessage] = useState("");

  const { namaPengguna, kataSandi } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skenario Utama (Use Case Scenario #2 [cite: 212])
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Bersihkan pesan error sebelumnya

    try {
      // 1. User memasukkan kredensial dan submit
      // 2. Sistem mengecek (ini dilakukan oleh fungsi 'login' di context)
      await login(namaPengguna, kataSandi);

      // 3. Sistem memberikan akses & redirect
      navigate("/dashboard"); // Arahkan ke dashboard jika sukses
    } catch (err) {
      // Skenario Eksepsional: Jika kredensial salah [cite: 212]
      setMessage(err.message || "Login gagal. Periksa kembali data Anda.");
    }
  };

  return (
    <div className="form-container">
      <h1>
        DokuIn - <span className="text-primary">Login</span>
      </h1>
      {/* Tampilkan pesan error jika ada */}
      {message && <div className="alert-message">{message}</div>}

      {/* Formulir berdasarkan UI Design #2 [cite: 213, 233] */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="namaPengguna">Nama User</label>
          <input type="text" name="namaPengguna" value={namaPengguna} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="kataSandi">Password</label>
          <input type="password" name="kataSandi" value={kataSandi} onChange={onChange} required />
        </div>
        <input type="submit" value="Login (Done)" className="btn btn-primary btn-block" />
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Belum punya akun? <Link to="/register">Registrasi di sini</Link>
      </p>
    </div>
  );
};

export default Login;

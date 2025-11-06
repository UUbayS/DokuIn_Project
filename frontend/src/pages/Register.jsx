// frontend/src/pages/Register.jsx

import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from 'react-router-dom'; // Kita akan gunakan ini nanti

const Register = () => {
  // const navigate = useNavigate(); // Untuk pindah halaman setelah register

  // State untuk menyimpan data formulir
  const [formData, setFormData] = useState({
    namaPengguna: "",
    email: "", // Diperlukan oleh backend model
    kataSandi: "",
    kataSandi2: "", // Untuk "Re-Confirm"
  });

  // State untuk pesan error atau sukses
  const [message, setMessage] = useState("");

  // Destructuring agar mudah digunakan di <input>
  const { namaPengguna, email, kataSandi, kataSandi2 } = formData;

  // Fungsi ini dipanggil setiap kali ada perubahan di input form
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi ini dipanggil saat form di-submit (Button Done)
  const onSubmit = async (e) => {
    e.preventDefault(); // Mencegah halaman reload

    // Skenario Eksepsional: Validasi sisi client
    if (kataSandi !== kataSandi2) {
      setMessage("Password dan Re-Confirm Password tidak cocok");
      return;
    }

    // Skenario Utama 3: User mengisi informasi
    try {
      const newUser = {
        namaPengguna,
        email,
        kataSandi,
      };

      // Skenario Utama 4 & 5: Sistem memvalidasi dan membuat akun
      // Kita kirim request ke backend.
      // Perhatikan path '/api/auth/register'
      const res = await axios.post("/api/auth/register", newUser);

      // Jika berhasil
      setMessage(res.data.msg || "Registrasi berhasil!");

      // Kosongkan form
      setFormData({
        namaPengguna: "",
        email: "",
        kataSandi: "",
        kataSandi2: "",
      });

      // Nanti kita bisa arahkan ke halaman login
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Skenario Eksepsional: Jika sistem menampilkan pesan kesalahan
      setMessage(err.response.data.msg || "Registrasi gagal. Coba lagi.");
    }
  };

  return (
    <div className="form-container">
      <h1>
        DokuIn - <span className="text-primary">Registrasi Akun</span>
      </h1>
      {message && <div className="alert-message">{message}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="namaPengguna">Nama User</label>
          <input type="text" name="namaPengguna" value={namaPengguna} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="kataSandi">Password</label>
          <input type="password" name="kataSandi" value={kataSandi} onChange={onChange} minLength="6" required />
        </div>
        <div className="form-group">
          <label htmlFor="kataSandi2">Re-Confirm Password</label>
          <input type="password" name="kataSandi2" value={kataSandi2} onChange={onChange} minLength="6" required />
        </div>
        <input type="submit" value="Register (Done)" className="btn btn-primary btn-block" />
      </form>
    </div>
  );
};

export default Register;

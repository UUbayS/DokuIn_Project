// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/UploadForm";
import DokumenList from "../components/DokumenList";

const Dashboard = () => {
  const { logout, isAuthLoading } = useAuth(); // Ambil isAuthLoading
  const navigate = useNavigate();

  // --- PINDAHKAN STATE DARI DOKUMENLIST KE SINI ---
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- BUAT FUNGSI FETCH DI SINI ---
  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/dokumen/my-dokumen");
      setDokumenList(res.data);
      setError(""); // Hapus error lama jika sukses
    } catch (err) {
      setError("Gagal memuat dokumen");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MODIFIKASI USEEFFECT ---
  useEffect(() => {
    // Jalankan HANYA jika auth sudah selesai dicek
    if (!isAuthLoading) {
      fetchDokumen();
    }
  }, [isAuthLoading]); // Bergantung pada status loading auth

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>DokuIn Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        {/* Kirim fungsi 'fetchDokumen' sebagai prop.
            Ini akan dipanggil oleh UploadForm saat sukses. */}
        <UploadForm onUploadSuccess={fetchDokumen} />

        <hr className="divider" />

        {/* Kirim state sebagai prop ke DokumenList */}
        <DokumenList
          dokumenList={dokumenList}
          isLoading={isLoading || isAuthLoading} // Loading jika data ATAU auth loading
          error={error}
        />
      </main>
    </div>
  );
};

export default Dashboard;

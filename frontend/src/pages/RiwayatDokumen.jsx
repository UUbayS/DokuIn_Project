// frontend/src/pages/RiwayatDokumen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./RiwayatDokumen.css"; // Kita akan buat file CSS ini

import {
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiMinusCircle, // Menggunakan ini untuk 'Pending' agar sesuai gambar
  HiEye,
} from "react-icons/hi";

// URL Backend (sama seperti di DokumenList.jsx)
const BACKEND_URL = "http://localhost:5000";

// Helper function untuk mendapatkan style status
// Sedikit diubah dari Dashboard.jsx agar lebih sesuai dengan tabel
const getStatusProps = (status) => {
  switch (status) {
    case "Disetujui":
      return {
        icon: <HiCheckCircle size={22} />,
        colorClass: "status-disetujui",
      };
    case "Ditolak":
      return {
        icon: <HiXCircle size={22} />,
        colorClass: "status-ditolak",
      };
    case "Pending":
      return {
        icon: <HiMinusCircle size={22} />,
        colorClass: "status-pending",
      };
    default:
      return {
        icon: null,
        colorClass: "status-gray",
      };
  }
};

const RiwayatDokumen = () => {
  const { isAuthLoading } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Logika pengambilan data, sama seperti di Dashboard.jsx
  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/dokumen/my-dokumen");
      // Mengurutkan agar yang terbaru di atas
      setDokumenList(res.data.sort((a, b) => new Date(b.tanggalUnggah) - new Date(a.tanggalUnggah)));
      setError("");
    } catch (err) {
      setError("Gagal memuat riwayat dokumen");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Hanya fetch data jika autentikasi selesai
    if (!isAuthLoading) {
      fetchDokumen();
    }
  }, [isAuthLoading]); // <-- Dependency-nya adalah isAuthLoading

  // Tampilkan pesan loading
  if (isLoading || isAuthLoading) {
    return <div className="page-loading">Memuat riwayat dokumen...</div>;
  }

  // Tampilkan pesan error
  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="riwayat-page-container">
      <h1 className="main-content-title">Riwayat Dokumen</h1>

      <div className="riwayat-table-container">
        <table className="riwayat-table">
          <thead>
            <tr>
              <th>Nama Dokumen</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dokumenList.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-row">
                  Belum ada dokumen yang di-upload.
                </td>
              </tr>
            ) : (
              dokumenList.map((doc) => {
                const statusProps = getStatusProps(doc.status);
                return (
                  <tr key={doc._id}>
                    {/* Sel Nama Dokumen */}
                    <td className="cell-nama-dokumen">
                      <HiDocumentText size={32} className="doc-icon" />
                      <div className="doc-info">
                        <span className="doc-name">
                          {doc.judul || "Dokumen"}
                        </span>
                        <span className="doc-date">
                          {new Intl.DateTimeFormat('fr-CA', { // Menggunakan locale fr-CA untuk format YYYY-MM-DD
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).format(new Date(doc.tanggalUnggah))}
                        </span>
                      </div>
                    </td>

                    {/* Sel Status */}
                    <td className="cell-status">
                      <div className={`status-badge ${statusProps.colorClass}`}>
                        <span>{doc.status}</span>
                        {statusProps.icon}
                      </div>
                    </td>

                    {/* Sel Aksi */}
                    <td className="cell-aksi">
                      <a
                        href={`${BACKEND_URL}/${doc.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button"
                        title="Lihat Dokumen"
                      >
                        <HiEye size={22} />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatDokumen;
// frontend/src/pages/DetailDokumen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DetailDokumen.css"; // <-- Anda juga perlu file CSS baru

import {
  HiOutlineDocumentText,
  HiUserCircle,
  HiCheckCircle,
  HiXCircle,
  HiMinusCircle,
} from "react-icons/hi";

// ... (Helper function getStatusProps)
const getStatusProps = (status) => {
  switch (status) {
    case "Disetujui":
      return { icon: <HiCheckCircle size={24} />, colorClass: "status-disetujui" };
    case "Ditolak":
      return { icon: <HiXCircle size={24} />, colorClass: "status-ditolak" };
    case "Pending":
      return { icon: <HiMinusCircle size={24} />, colorClass: "status-pending" };
    default:
      return { icon: null, colorClass: "status-gray" };
  }
};

// ... (Helper function formatDateTime dan formatDate)
const formatDateTime = (isoString) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
  }).format(new Date(isoString));
};

const formatDate = (isoString) => {
  return new Intl.DateTimeFormat('fr-CA').format(new Date(isoString));
};

const DetailDokumen = () => {
  const { id } = useParams(); // Mendapatkan ID dari URL
  const { isAuthLoading } = useAuth();
  const [dokumen, setDokumen] = useState(null);
  const [komentar, setKomentar] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetailDokumen = async () => {
      if (isAuthLoading) return; // Tunggu auth selesai
      
      setIsLoading(true);
      try {
        // 1. Ambil data dokumen
        const resDokumen = await axios.get(`/api/dokumen/${id}`);
        setDokumen(resDokumen.data);

        // 2. Ambil data komentar (Ganti dengan endpoint Anda)
        const mockKomentar = [
          { _id: "k1", user: { username: "username2", role: "Admin" }, teks: "Excepteur sint occaecat cupidatat non proident...", tanggal: "2025-11-04T10:00:00.000Z" },
          { _id: "k2", user: { username: "username", role: "Karyawan" }, teks: "Ut enim ad minim veniam, quis nostrud...", tanggal: "2025-11-04T11:30:00.000Z" },
        ];
        setKomentar(mockKomentar);
        
        setError("");
      } catch (err) {
        setError("Gagal memuat detail dokumen.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetailDokumen();
  }, [id, isAuthLoading]);

  if (isLoading || isAuthLoading) {
    return <div className="page-loading">Memuat detail dokumen...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  if (!dokumen) {
    return <div className="page-error">Dokumen tidak ditemukan.</div>;
  }
  
  const statusProps = getStatusProps(dokumen.status);

  return (
    <div className="detail-page-container">
      {/* === Bagian Header Detail Dokumen === */}
      <div className="detail-header">
        <h2>Detail Dokumen</h2>
      </div>

      <div className="document-card">
        <div className="document-content">
          <div className="doc-icon-placeholder">
            <HiOutlineDocumentText size={64} />
          </div>
          <div className="doc-info-main">
            <div className="doc-header">
              <h1 className="doc-title">{dokumen.judul || "Dokumen"}</h1>
              <div className={`doc-status ${statusProps.colorClass}`}>
                {statusProps.icon}
                <span>{dokumen.status}</span>
              </div>
            </div>
            <div className="doc-meta">
              <span>Tanggal Upload: {formatDateTime(dokumen.tanggalUnggah)}</span>
              <span>Jenis Dokumen: {dokumen.jenisDokumen || "Tidak ada"}</span>
            </div>
            <div className="doc-description">
              <h3>Deskripsi</h3>
              <p>{dokumen.deskripsi || "Tidak ada deskripsi."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === Bagian Komentar === */}
      <div className="comment-section-header">
        <h2>Komentar Dokumen</h2>
      </div>

      <div className="comment-list-card">
        {komentar.length === 0 ? (
          <p className="no-comments">Belum ada komentar.</p>
        ) : (
          komentar.map((kom) => (
            <div className="comment-item" key={kom._id}>
              <HiUserCircle size={40} className="comment-avatar" />
              <div className="comment-content">
                <div className="comment-header">
                  <div className="comment-user-info">
                    <span className="comment-user-name">{kom.user.username}</span>
                    <span className="comment-user-role">{kom.user.role}</span>
                  </div>
                  <span className="comment-date">{formatDate(kom.tanggal)}</span>
                </div>
                <p className="comment-body">{kom.teks}</p>
                <Link to="#" className="comment-reply">Reply</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DetailDokumen;
// frontend/src/pages/DetailDokumen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DetailDokumen.css";

import {
  HiOutlineDocumentText,
  HiUserCircle,
  HiCheckCircle,
  HiXCircle,
  HiMinusCircle,
  HiTrash,
  HiPaperAirplane,
} from "react-icons/hi";

const getStatusProps = (status) => {
  switch (status) {
    case "Disetujui":
      return { icon: <HiCheckCircle size={24} />, colorClass: "status-disetujui" };
    case "Ditolak":
      return { icon: <HiXCircle size={24} />, colorClass: "status-ditolak" };
    case "Menunggu Persetujuan":
      return { icon: <HiMinusCircle size={24} />, colorClass: "status-pending" };
    default:
      return { icon: null, colorClass: "status-gray" };
  }
};

const formatDateTime = (isoString) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
  }).format(new Date(isoString));
};

const formatDate = (isoString) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date(isoString));
};

const DetailDokumen = () => {
  const { id } = useParams();
  const { isAuthLoading, user } = useAuth();
  const [dokumen, setDokumen] = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form komentar
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  // Cek apakah user bisa comment (admin atau pemilik dokumen)
  const canComment = user?.role === "Administrator" || 
    (dokumen && dokumen.karyawanId === user?.id);

  const fetchDetailDokumen = async () => {
    if (isAuthLoading) return;
    
    setIsLoading(true);
    try {
      // 1. Ambil data dokumen
      const resDokumen = await axios.get(`/api/dokumen/${id}`);
      setDokumen(resDokumen.data);

      // 2. Ambil data komentar
      const resKomentar = await axios.get(`/api/comments/${id}`);
      setKomentar(resKomentar.data);
      
      setError("");
    } catch (err) {
      setError("Gagal memuat detail dokumen.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailDokumen();
  }, [id, isAuthLoading]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError("Komentar tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    setCommentError("");

    try {
      const res = await axios.post(`/api/comments/${id}`, {
        isi: newComment.trim()
      });

      // Tambahkan komentar baru ke list (di awal karena sorted desc)
      setKomentar([res.data, ...komentar]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      setCommentError(err.response?.data?.msg || "Gagal mengirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      return;
    }

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setKomentar(komentar.filter(k => k._id !== commentId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Gagal menghapus komentar");
    }
  };

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
        {/* Form input komentar */}
        {canComment && (
          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="comment-input-wrapper">
              <HiUserCircle size={40} className="comment-avatar" />
              <div className="comment-input-container">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar..."
                  rows={3}
                  disabled={isSubmitting}
                  className="comment-textarea"
                />
                {commentError && (
                  <div className="comment-error">{commentError}</div>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim()}
                  className="comment-submit-btn"
                >
                  <HiPaperAirplane size={18} />
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </form>
        )}

        {!canComment && (
          <div className="comment-no-access">
            <p>Anda hanya bisa berkomentar di dokumen Anda sendiri.</p>
          </div>
        )}

        {/* Daftar komentar */}
        {komentar.length === 0 ? (
          <p className="no-comments">Belum ada komentar.</p>
        ) : (
          komentar.map((kom) => {
            const isOwner = kom.userId?._id === user?.id;
            const isAdmin = user?.role === "Administrator";
            const canDelete = isOwner || isAdmin;

            return (
              <div className="comment-item" key={kom._id}>
                <HiUserCircle size={40} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <div className="comment-user-info">
                      <span className="comment-user-name">
                        {kom.userId?.namaPengguna || "Unknown"}
                      </span>
                      <span className={`comment-user-role ${kom.userId?.role === "Administrator" ? "role-admin" : "role-karyawan"}`}>
                        {kom.userId?.role || "Karyawan"}
                      </span>
                    </div>
                    <div className="comment-actions">
                      <span className="comment-date">{formatDate(kom.createdAt)}</span>
                      {canDelete && (
                        <button 
                          onClick={() => handleDeleteComment(kom._id)}
                          className="comment-delete-btn"
                          title="Hapus komentar"
                        >
                          <HiTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="comment-body">{kom.isi}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DetailDokumen;
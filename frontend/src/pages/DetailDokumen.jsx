// frontend/src/pages/DetailDokumen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DetailDokumen.css";
import { useNavigate, useLocation } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';

import { getStatusConfig } from "../utils/statusHelper";
import { formatDate, formatDateTime } from "../utils/dateHelper";

import {
  HiOutlineDocumentText,
  HiUserCircle,
  HiTrash,
  HiPaperAirplane,
  HiDownload,
  HiExclamation
} from "react-icons/hi";

const DetailDokumen = () => {
  const { id } = useParams();
  const { isAuthLoading, user } = useAuth();
  const [dokumen, setDokumen] = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Form komentar
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  // Cek apakah user bisa comment (admin atau pemilik dokumen)
  const canComment = user?.role === "Administrator" || 
    (dokumen && dokumen.karyawanId === user?.id);

  // Ubah parameter agar menerima docTitle
const fetchFilePreview = async (docId, docTitle) => {
  setIsPreviewLoading(true);
  try {
    const res = await axios.get(`/api/dokumen/download/${docId}`, {
      responseType: "arraybuffer", 
      headers: { "x-auth-token": localStorage.getItem("token") }
    });

    const contentType = res.headers["content-type"] || "application/pdf";
    setFileType(contentType);

    if (contentType === "application/pdf") {
      const pdfDoc = await PDFDocument.load(res.data);
      pdfDoc.setTitle(docTitle || "Dokumen Preview");

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } 
    else {
      const blob = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }

  } catch (err) {
    console.error("Gagal memuat preview:", err);
  } finally {
    setIsPreviewLoading(false);
  }
};

  const fetchDetailDokumen = async () => {
    if (isAuthLoading) return;
    
    setIsLoading(true);
    try {
      // Ambil data dokumen
      const resDokumen = await axios.get(`/api/dokumen/${id}`);
      setDokumen(resDokumen.data);

      // Ambil data komentar
      const resKomentar = await axios.get(`/api/comments/${id}`);
      setKomentar(resKomentar.data);

      //Ambil data preview file
      fetchFilePreview(id, resDokumen.data.judul);
      
      setError("");
    } catch (err) {
      setError("Gagal memuat detail dokumen.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    if (isPreviewLoading) {
      return <div className="preview-loading">Memuat tampilan dokumen...</div>;
    }

    if (!previewUrl) {
      return (
        <div className="preview-error">
           <HiExclamation size={40} />
           <p>Gagal memuat file atau file tidak ditemukan.</p>
        </div>
      );
    }

    // A. Jika PDF
    if (fileType === "application/pdf") {
      return (
        <iframe 
          src={previewUrl} 
          title="Dokumen Preview"
          className="preview-iframe"
        />
      );
    }

    // B. Jika Gambar
    if (fileType.startsWith("image/")) {
      return (
        <img 
          src={previewUrl} 
          alt="Preview Dokumen" 
          className="preview-image"
        />
      );
    }

    // C. File Lain (Word, Excel, ZIP) - Browser tidak bisa preview native
    return (
      <div className="preview-unsupported">
        <HiOutlineDocumentText size={60} />
        <p>Pratinjau tidak tersedia untuk tipe file ini.</p>
        <button onClick={handleManualDownload} className="btn-download-manual">
          <HiDownload size={18} /> Download File
        </button>
      </div>
    );
  };

  useEffect(() => {
    fetchDetailDokumen();
    if (user?.role === "Administrator" && !location.pathname.startsWith("/admin")) {
      // Lempar ke URL Admin
      navigate(`/admin/dokumen/${id}`);
    }
  }, [user, location, id, isAuthLoading]);

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
  
  const statusConfig = getStatusConfig(dokumen.status);

  return (
    <div className="detail-page-container">
      {/* === Bagian Header Detail Dokumen === */}
      <div className="detail-header">
        <h2>Detail Dokumen</h2>
      </div>

      {/* === Bagian Isi Detail Dokumen === */}
      <div className="document-card">
        <div className="document-content">
          <div className="doc-info-main">
            <div className="doc-header">
              <h1 className="doc-title">{dokumen.judul || "Dokumen"}</h1>
              <div className={`doc-status ${statusConfig.colorClass}`}>
                {statusConfig.icon}
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
        {/* === Bagian Preview Dokumen === */}
        <div className="doc-preview-container">
          {renderPreview()}
        </div>
      </div>

      {/* === Bagian Komentar === */}
      <div className="comment-section-header">
        <h2>Komentar Dokumen</h2>
      </div>

      <div className="comment-list-card">
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
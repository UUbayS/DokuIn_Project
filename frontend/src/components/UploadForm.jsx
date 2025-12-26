// frontend/src/components/UploadForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiCheckCircle, HiQuestionMarkCircle, HiUpload } from 'react-icons/hi';
import "./UploadForm.css"

const UploadForm = () => {
  const navigate = useNavigate();

  // State untuk semua field formulir
  const [namaDokumen, setNamaDokumen] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [file, setFile] = useState(null);
  
  // State untuk mengontrol UI (modal, error, drag)
  const [message, setMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- Handlers untuk Modal & Navigasi ---

  // Dipanggil saat tombol "Upload" utama diklik
  const handleOpenConfirm = (e) => {
    e.preventDefault();
    // Validasi form sebelum membuka konfirmasi
    if (!namaDokumen || !jenisDokumen || !file) {
      setMessage('Nama Dokumen, Jenis Dokumen, dan File wajib diisi.');
      return;
    }
    setMessage('');
    setIsConfirmOpen(true); // Buka modal konfirmasi
  };

  // Untuk tombol "Cancel" pada form
  const handleCancel = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  // Untuk tombol "Kembali" pada modal sukses
  const handleSuccessModalClose = () => {
    setIsSuccessOpen(false);
    navigate('/dashboard'); // Arahkan ke Riwayat Dokumen
  };

  // --- Handlers untuk File Drag-and-Drop ---

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // --- Handler untuk Submit Akhir ---

  // Dipanggil saat tombol "Submit" di modal konfirmasi diklik
  const handleSubmit = async () => {
    setIsConfirmOpen(false); // Tutup modal konfirmasi

    if (!file) {
      setMessage('File tidak ditemukan.');
      return;
    }

    // Buat FormData untuk dikirim ke API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('judul', namaDokumen); 
    formData.append('jenisDokumen', jenisDokumen);
    formData.append('deskripsi', deskripsi);

    try {
      // Kirim data ke backend
      await axios.post('/api/dokumen/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Jika berhasil, buka modal sukses
      setIsSuccessOpen(true);
      
      // Reset form
      setNamaDokumen('');
      setJenisDokumen('');
      setDeskripsi('');
      setFile(null);
      setMessage('');

    } catch (err) {
      // Jika gagal, tampilkan pesan error
      setMessage(err.response?.data?.msg || 'Upload Gagal. Terjadi kesalahan.');
    }
  };

  return (
    // <React.Fragment> untuk membungkus form dan modal
    <>
      {/* Tampilkan pesan error jika ada */}
      {message && <div className="alert-message">{message}</div>}

      {/* Kontainer Putih untuk Formulir */}
      <div className="upload-container">
        <form onSubmit={handleOpenConfirm} className="upload-form-layout">
          
          {/* Kolom Kiri: Input Fields */}
          <div className="upload-form-left">
            <div className="form-group-stacked">
              <label htmlFor="namaDokumen">Nama Dokumen</label>
              <input
                type="text"
                id="namaDokumen"
                value={namaDokumen}
                onChange={(e) => setNamaDokumen(e.target.value)}
                placeholder="Nama Dokumen"
                required
              />
            </div>
            
            <div className="form-group-stacked">
              <label htmlFor="jenisDokumen">Jenis Dokumen</label>
              <select
                id="jenisDokumen"
                value={jenisDokumen}
                onChange={(e) => setJenisDokumen(e.target.value)}
                required
              >
                <option value="" disabled>Pilih Jenis Dokumen</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Proposal">Proposal</option>
                <option value="Surat">Surat Izin</option>
                <option value="Kontrak">Laporan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            
            <div className="form-group-stacked">
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea
                id="deskripsi"
                rows="5"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi"
              ></textarea>
            </div>
          </div>

          {/* Kolom Kanan: File Upload */}
          <div className="upload-form-right">
            <label htmlFor="file-upload" className="upload-area-label">
              Upload Dokumen
            </label>
            <div
              className={`upload-drop-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                type="file"
                id="file-upload"
                onChange={onFileChange}
                accept="application/pdf" // Hanya PDF
                hidden
                required
              />
              <HiUpload size={48} className="upload-drop-icon" />
              {file ? (
                <span className="upload-drop-text-filled">{file.name}</span>
              ) : (
                <span className="upload-drop-text">
                  Pilih atau Masukkan Dokumen
                </span>
              )}
            </div>
          </div>

          {/* Tombol Aksi Form */}
          <div className="upload-form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </div>
        </form>
      </div>

      {/* ===== MODAL KONFIRMASI (Pop-Up 1) ===== */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <HiQuestionMarkCircle size={80} className="modal-icon-confirm" />
            <h2 className="modal-title">Konfirmasi</h2>
            <p className="modal-text">Apakah yang Anda isi sudah benar?</p>
            <div className="modal-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL SUKSES (Pop-Up 2) ===== */}
      {isSuccessOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <HiCheckCircle size={80} className="modal-icon-success" />
            <h2 className="modal-title">Dokumen berhasil disimpan!</h2>
            <div className="modal-buttons-single">
              <button className="btn btn-primary" onClick={handleSuccessModalClose}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadForm;





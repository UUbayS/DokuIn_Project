// frontend/src/components/UploadForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [judul, setJudul] = useState(""); // Sesuai UI "Nama File" [cite: 684]
  const [message, setMessage] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onJudulChange = (e) => {
    setJudul(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !judul) {
      setMessage("Judul dan file (PDF) harus diisi!");
      return;
    }

    // PENTING: Kita harus menggunakan FormData
    const formData = new FormData();
    formData.append("file", file); // 'file' harus cocok dgn di backend
    formData.append("judul", judul); // 'judul' harus cocok dgn di backend

    try {
      // Token (x-auth-token) sudah di-set secara global di AuthContext
      const res = await axios.post("/api/dokumen/upload", formData, {
        headers: {
          // Axios akan otomatis set 'Content-Type': 'multipart/form-data'
          // saat kita mengirim FormData
        },
      });

      setMessage(res.data.msg || "Upload berhasil!");
      setFile(null);
      setJudul("");
      // Reset input file (agak tricky)
      e.target.reset();
      onUploadSuccess();
    } catch (err) {
      setMessage(err.response.data.msg || "Upload Gagal. Pastikan file adalah PDF.");
    }
  };

  return (
    <div className="upload-form-container">
      <h3>Upload Dokumen Baru</h3>
      {message && <div className="alert-message">{message}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          {/* Sesuai UI Design #5: Text Box Nama File [cite: 684] */}
          <label htmlFor="judul">Judul Dokumen (Nama File)</label>
          <input type="text" name="judul" value={judul} onChange={onJudulChange} required />
        </div>
        <div className="form-group">
          {/* Sesuai UI Design #5: Menu Upload File [cite: 684] */}
          <label htmlFor="file">Pilih File (PDF)</label>
          <input
            type="file"
            name="file"
            onChange={onFileChange}
            required
            accept="application/pdf" // Hanya izinkan PDF di browser
          />
        </div>
        <input
          type="submit"
          value="Upload" // Sesuai UI Design #5 [cite: 684]
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default UploadForm;
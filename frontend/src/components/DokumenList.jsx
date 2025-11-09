// frontend/src/components/DokumenList.jsx

import React from "react";

const BACKEND_URL = "http://localhost:5000";

// 1. Terima state dari props (kiriman dari Dashboard)
const DokumenList = ({ dokumenList, isLoading, error }) => {
  // 2. HAPUS SEMUA useState dan useEffect. Logikanya sudah pindah.

  if (isLoading) {
    return <p>Memuat riwayat dokumen...</p>;
  }

  if (error) {
    return <p className="alert-message">{error}</p>;
  }

  return (
    <div className="dokumen-list-container">
      <h3>Riwayat Upload Dokumen</h3>
      {dokumenList.length === 0 ? (
        <p>Anda belum meng-upload dokumen apa pun.</p>
      ) : (
        <table className="dokumen-table">
          {/* ... (kode tabel Anda tidak berubah) ... */}
          <thead>
            <tr>
              <th>Judul</th>
              <th>Status</th>
              <th>Tanggal Upload</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {dokumenList.map((dokumen) => (
              <tr key={dokumen._id}>
                <td>{dokumen.judul}</td>
                <td>{dokumen.status}</td>
                <td>{new Date(dokumen.tanggalUnggah).toLocaleDateString("id-ID")}</td>
                <td>
                  <a href={`${BACKEND_URL}/${dokumen.filePath}`} target="_blank" rel="noopener noreferrer" className="btn-download">
                    Lihat/Unduh
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DokumenList;

// frontend/src/pages/RiwayatDokumen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RiwayatDokumen.css"; 

// Import Helpers
import { downloadDocument } from "../utils/downloadHelper";
import { getStatusConfig } from "../utils/statusHelper";
import { formatDate } from "../utils/dateHelper"; 
import { filterDocuments } from "../utils/filterHelper";

import {
  HiDocumentText,
  HiEye,
  HiDownload,
  HiSearch,
  HiFilter,
  HiFolder
} from "react-icons/hi";

const RiwayatDokumen = () => {
  const { isAuthLoading, user } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterType, setFilterType] = useState("Semua");

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

  const handleDownload = async (doc) => {
    await downloadDocument(doc._id, doc.judul);
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchDokumen();
    }
  }, [isAuthLoading]);

  if (isLoading || isAuthLoading) {
    return <div className="page-loading">Memuat riwayat dokumen...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  const filteredList = filterDocuments(dokumenList, searchTerm, filterStatus, filterType);

  const uniqueTypes = ["Semua", ...new Set(dokumenList.map(d => d.jenisDokumen).filter(Boolean))];

  return (
    <div className="riwayat-page-container">
      <h1 className="main-content-title">Riwayat Dokumen</h1>

      <div className="filter-section">
        {/* 1. Search Box */}
        <div className="search-box">
          <HiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama dokumen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 2. Filter Status */}
        <div className="filter-box">
          <HiFilter className="filter-icon" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu Persetujuan">Menunggu</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        {/* 3. Filter Jenis Dokumen */}
        <div className="filter-box">
          <HiFolder className="filter-icon" />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Semua">Semua Jenis</option>
            <option value="Pribadi">Pribadi</option>
            <option value="Proposal">Proposal</option>
            <option value="Surat">Surat Izin</option>
            <option value="Kontrak">Laporan</option>
            <option value="Lainnya">Lainnya</option> 
          </select>
        </div>
      </div>

      <div className="riwayat-table-container">
        <table className="riwayat-table">
          <thead>
            <tr>
              <th className="th-left">Nama Dokumen</th>
              <th className="th-center" width="200">Status</th>
              <th className="th-center" width="100">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-row">
                  {dokumenList.length === 0 
                    ? "Belum ada dokumen yang di-upload." 
                    : "Tidak ditemukan dokumen yang cocok."}
                </td>
              </tr>
            ) : (
              filteredList.map((doc) => {
                const statusConfig = getStatusConfig(doc.status);

                const detailPath = user?.role === 'Administrator'
                  ? `/admin/dokumen/${doc._id}` 
                  : `/dokumen/${doc._id}`;

                return (
                  <tr key={doc._id}>
                    {/* Sel Nama Dokumen */}
                    <td>
                      <div className="doc-wrapper">
                        <div className="doc-icon-box">
                           <HiDocumentText size={28} />
                        </div>
                        <div> 
                          <div className="doc-info-name">
                            <span className="doc-name">{doc.judul || "Dokumen"}</span>
                          </div>
                          <div className="doc-info-date">
                            {formatDate(doc.tanggalUnggah)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sel Status */}
                    <td className="cell-center">
                      <div className={`status-badge ${statusConfig.colorClass}`}>
                        <span>{doc.status}</span>
                        {statusConfig.icon}
                      </div>
                    </td>

                    {/* Sel Aksi */}
                    <td className="cell-center">
                      <div className="actions-wrapper">
                        <Link
                          to={detailPath}
                          className="action-button btn-view"
                          title="Lihat Detail Dokumen"
                        >
                          <HiEye size={20} />
                        </Link>
                        <button
                            type="button"
                            onClick={() => handleDownload(doc)}
                            className="action-button btn-download"
                            title="Download"
                          >
                            <HiDownload size={20} />
                        </button>
                      </div>
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
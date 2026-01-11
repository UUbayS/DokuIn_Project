// frontend/src/pages/admin/KelolaDokumen.jsx
// Halaman untuk Admin melihat semua dokumen dan melakukan approval/reject

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatsCard from "../../components/statscard";

import { downloadDocument } from "../../utils/downloadHelper";
import { getStatusConfig } from "../../utils/statusHelper";
import { filterDocuments } from "../../utils/filterHelper";
import "./KelolaDokumen.css";

import {
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiDownload,
  HiUser,
  HiEye,
  HiSearch,
  HiFilter,
  HiFolder
} from "react-icons/hi";

const KelolaDokumen = () => {
  const { isAuthLoading, user } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterType, setFilterType] = useState("Semua");

  const fetchAllDokumen = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/dokumen/admin/all");
      setDokumenList(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching dokumen:", err);
      setError(err.response?.data?.msg || "Gagal memuat dokumen");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchAllDokumen();
    }
  }, [isAuthLoading]);

  const accessibleDocuments = useMemo(() => {
    if (!user || dokumenList.length === 0) return [];

    // Jika Super Admin, kembalikan semua
    if (user.role === 'Administrator') {
      return dokumenList;
    }

    // Jika HRD: Hanya Pribadi & Surat (Surat Izin)
    if (user.role === 'hrd') {
      return dokumenList.filter(doc => 
        ['Pribadi', 'Surat', 'Surat Izin'].includes(doc.jenisDokumen)
      );
    }

    // Jika Operational Manager: Hanya Proposal & Laporan
    if (user.role === 'operational_manager') {
      return dokumenList.filter(doc => 
        ['Proposal', 'Laporan'].includes(doc.jenisDokumen)
      );
    }

    return [];
  }, [dokumenList, user]);

  const filteredList = filterDocuments(accessibleDocuments, searchTerm, filterStatus, filterType);

  const uniqueTypes = ["Semua", ...new Set(accessibleDocuments.map(d => d.jenisDokumen).filter(Boolean))];
  
  const handleUpdateStatus = async (docId, newStatus) => {
    setActionLoading(docId);
    try {
      await axios.put(`/api/dokumen/admin/status/${docId}`, { status: newStatus });

      setDokumenList((prev) =>
        prev.map((doc) =>
          doc._id === docId ? { ...doc, status: newStatus } : doc
        )
      );
    } catch (err) {
      console.error("Gagal update status:", err);
      alert(err.response?.data?.msg || "Gagal mengupdate status dokumen");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (doc) => {
    await downloadDocument(doc._id, doc.judul);
  };

  // Stats
  const totalDokumen = accessibleDocuments.length;
  const totalPending = accessibleDocuments.filter(
    (d) => d.status === "Menunggu Persetujuan"
  ).length;
  const totalDisetujui = accessibleDocuments.filter(
    (d) => d.status === "Disetujui"
  ).length;
  const totalDitolak = accessibleDocuments.filter(
    (d) => d.status === "Ditolak"
  ).length;

  return (
    <div className="kelola-dokumen-container">
      <h1 className="page-header">
        <HiDocumentText size={28} />
        Kelola Dokumen Karyawan
      </h1>

      <div className="stats-grid">
        <StatsCard
          title="Total Dokumen"
          value={totalDokumen}
          colorClass="total"
        />
        <StatsCard
          title="Menunggu Persetujuan"
          value={totalPending}
          colorClass="pending"
        />
        <StatsCard
          title="Disetujui"
          value={totalDisetujui}
          colorClass="approved"
        />
        <StatsCard
          title="Ditolak"
          value={totalDitolak}
          colorClass="rejected"
        />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="search-box">
          <HiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama dokumen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

        <div className="filter-box">
          <HiFolder className="filter-icon" />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            {uniqueTypes.map((type, index) => (
               <option key={index} value={type}>
                 {type === "Semua" ? "Semua Jenis" : type}
               </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="dokumen-table-container">
        {isLoading || isAuthLoading ? (
          <div className="loading-message">Memuat data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : accessibleDocuments.length === 0 ? (
          <div className="empty-message">
            Tidak ada dokumen yang sesuai dengan akses Anda.
          </div>
        ) : ( 
          <table className="dokumen-table">
            <thead>
              <tr>
                <th>Dokumen</th>
                <th>Karyawan</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th className="center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    Tidak ditemukan dokumen yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((doc) => {
                  const statusProps = getStatusConfig(doc.status);
                  const isPending = doc.status === "Menunggu Persetujuan";
                  const isUpdating = actionLoading === doc._id;

                  return (
                    <tr key={doc._id}>
                      <td>
                        <div className="doc-cell">
                          <HiDocumentText size={20} className="doc-cell-icon" />
                          <div className="doc-info">
                            <div className="doc-title">{doc.judul}</div>
                            <div className="doc-type-badge">
                              {doc.jenisDokumen}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="karyawan-cell">
                          <HiUser size={16} />
                          <span>{doc.karyawanId?.namaPengguna || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="date-cell">
                        {new Date(doc.tanggalUnggah).toLocaleDateString("id-ID")}
                      </td>
                      <td>
                        <span className={`status-badge ${statusProps.colorClass}`}>
                          {statusProps.icon}
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(doc._id, "Disetujui")}
                                disabled={isUpdating}
                                title="Setujui"
                                className="btn-action approve"
                              >
                                <HiCheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(doc._id, "Ditolak")}
                                disabled={isUpdating}
                                title="Tolak"
                                className="btn-action reject"
                              >
                                <HiXCircle size={16} />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/dokumen/${doc._id}`}
                            title="Lihat Detail"
                            className="btn-action view"
                          >
                            <HiEye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDownload(doc)}
                            title="Download"
                            className="btn-action download"
                          >
                            <HiDownload size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KelolaDokumen;
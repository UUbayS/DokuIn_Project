// frontend/src/pages/admin/DokumenList.jsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Sesuaikan path import
import "./DokumenList.css"

// Import helpers (pastikan path sesuai)
import { downloadDocument } from "../utils/downloadHelper";
import { getStatusConfig } from "../utils/statusHelper";
import { filterDocuments } from "../utils/filterHelper";

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

const DokumenList = () => {
  const { isAuthLoading, user } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterType, setFilterType] = useState("Semua");

  const viewAsKaryawan = localStorage.getItem("viewAsKaryawan") === "true";

  // === ROLE LOGIC ===
  // Cek apakah user memiliki hak akses manajemen (Admin/HRD/Manager)
  const isKaryawan = user?.role === 'Karyawan';
  const isSuperAdmin = user?.role === 'Administrator';
  const isManager = ['hrd', 'operational_manager'].includes(user?.role);
  const canManage = (isSuperAdmin || isManager) && !viewAsKaryawan;

  // === FETCH DATA ===
  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      let endpoint = "";
      
      if (canManage) {
        // Jika Admin/Manager: Ambil semua dokumen
        endpoint = "/api/dokumen/admin/all";
      } else {
        // Jika Employee Biasa: Ambil dokumen sendiri
        endpoint = "/api/dokumen/my-dokumen";
      }

      const res = await axios.get(endpoint);
      
      // Sort: Terbaru di atas
      const sortedData = res.data.sort((a, b) => new Date(b.tanggalUnggah) - new Date(a.tanggalUnggah));
      setDokumenList(sortedData);
      setError("");
    } catch (err) {
      console.error("Error fetching dokumen:", err);
      setError(err.response?.data?.msg || "Gagal memuat dokumen");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchDokumen();
    }
  }, [isAuthLoading, user, viewAsKaryawan]);

  // === FILTERING LOGIC ===
  const accessibleDocuments = useMemo(() => {
    if (!user || dokumenList.length === 0) return [];

    // Jika Employee biasa atau Super Admin, return semua data yang didapat dari API
    if (isKaryawan || isSuperAdmin || viewAsKaryawan) {
      return dokumenList;
    }

    // Role-based filtering untuk Manager
    if (user.role === 'hrd') {
      return dokumenList.filter(doc => 
        ['Pribadi', 'Surat', 'Surat Izin'].includes(doc.jenisDokumen)
      );
    }

    if (user.role === 'operational_manager') {
      return dokumenList.filter(doc => 
        ['Proposal', 'Laporan'].includes(doc.jenisDokumen)
      );
    }

    return dokumenList;
  }, [dokumenList, user, canManage, isSuperAdmin, viewAsKaryawan]);

  const typeOptions = useMemo(() => {
    const allTypes = ["Pribadi", "Proposal", "Surat Izin", "Laporan"];

    if (viewAsKaryawan) return ["Semua", ...allTypes];

    if (user?.role === 'hrd') {
      return ["Semua", "Pribadi", "Surat Izin"];
    }
    
    if (user?.role === 'operational_manager') {
      return ["Semua", "Proposal", "Laporan"];
    }

    return ["Semua", ...allTypes];
  }, [user, viewAsKaryawan]);

  const filteredList = filterDocuments(accessibleDocuments, searchTerm, filterStatus, filterType);

  // === ACTIONS ===
  const handleUpdateStatus = async (docId, newStatus) => {
    if (!canManage) return;

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

  // Stats Logic (Hanya untuk Admin/Manager)
  const stats = {
    total: accessibleDocuments.length,
    pending: accessibleDocuments.filter(d => d.status === "Menunggu Persetujuan").length,
    approved: accessibleDocuments.filter(d => d.status === "Disetujui").length,
    rejected: accessibleDocuments.filter(d => d.status === "Ditolak").length,
  };

  return (
    <div className="dokumen-list-container">
      {/* FILTER SECTION */}
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
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
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
            {typeOptions.map((type, index) => (
                <option key={index} value={type}>
                  {type === "Semua" ? "Semua Jenis" : type}
                </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="dokumen-table-container">
        {isLoading || isAuthLoading ? (
          <div className="loading-message">Memuat data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : accessibleDocuments.length === 0 ? (
          <div className="empty-message">
            {canManage 
              ? "Tidak ada dokumen yang sesuai dengan akses Anda." 
              : "Anda belum mengunggah dokumen apapun."}
          </div>
        ) : ( 
          <table className="dokumen-table">
            <thead>
              <tr>
                <th>Dokumen</th>
                {/* Kolom Karyawan hanya untuk Admin/Manager */}
                {canManage && <th>Karyawan</th>}
                <th>Tanggal</th>
                <th className="center col-status">Status</th>
                <th className="center col-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? "5" : "4"} className="empty-row">
                    Tidak ditemukan dokumen yang cocok.
                  </td>
                </tr>
              ) : (
                filteredList.map((doc) => {
                  const statusProps = getStatusConfig(doc.status);
                  const isPending = doc.status === "Menunggu Persetujuan";
                  const isUpdating = actionLoading === doc._id;
                  
                  // Link detail berbeda untuk admin dan user biasa
                  const detailLink = canManage 
                    ? `/admin/dokumen/${doc._id}` 
                    : `/dokumen/${doc._id}`;

                  return (
                    <tr key={doc._id}>
                      {/* 1. Nama Dokumen */}
                      <td>
                        <div className="dokumen-cell">
                          <HiDocumentText size={24} className="dokumen-cell-icon" />
                          <div className="dokumen-info">
                            <span className="dokumen-title">{doc.judul}</span>
                            <span className="dokumen-type-badge">{doc.jenisDokumen}</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Nama Karyawan (Conditional) */}
                      {canManage && (
                        <td>
                          <div className="karyawan-cell">
                            <HiUser size={16} />
                            <span>{doc.karyawanId?.namaPengguna || "Unknown"}</span>
                          </div>
                        </td>
                      )}

                      {/* 3. Tanggal */}
                      <td className="date-cell">
                        {new Date(doc.tanggalUnggah).toLocaleDateString("id-ID")}
                      </td>

                      {/* 4. Status */}
                      <td className="center col-status">
                        <span className={`status-badge ${statusProps.colorClass}`}>
                          {statusProps.icon}
                          {doc.status}
                        </span>
                      </td>

                      {/* 5. Aksi */}
                      <td className="center col-aksi">
                        <div className="action-buttons">
                          {canManage && isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(doc._id, "Disetujui")}
                                disabled={isUpdating}
                                title="Setujui"
                                className="btn-action approve"
                              >
                                <HiCheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(doc._id, "Ditolak")}
                                disabled={isUpdating}
                                title="Tolak"
                                className="btn-action reject"
                              >
                                <HiXCircle size={18} />
                              </button>
                            </>
                          )}

                          <Link
                            to={detailLink}
                            title="Lihat Detail"
                            className="btn-action view"
                          >
                            <HiEye size={18} />
                          </Link>
                          
                          <button
                            onClick={() => handleDownload(doc)}
                            title="Download"
                            className="btn-action download"
                          >
                            <HiDownload size={18} />
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

export default DokumenList;
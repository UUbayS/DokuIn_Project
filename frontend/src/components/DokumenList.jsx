// frontend/src/pages/admin/DokumenList.jsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/statscard";
import "./DokumenList.css";

// Import helpers
import { downloadDocument } from "../utils/downloadHelper"; // Pastikan path ini benar
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
  const [successModal, setSuccessModal] = useState({ 
    isOpen: false, 
    type: "",
    docName: "" 
  });
    
  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterType, setFilterType] = useState("Semua");

  const viewAsKaryawan = localStorage.getItem("viewAsKaryawan") === "true";

  // === ROLE DEFINITIONS ===
  const isSuperAdmin = user?.role === "Super Admin" || user?.role === "Administrator";
  const isHRD = user?.role === "HRD";
  const isOperationalManager = user?.role === "Operasional Manajer" || user?.role === "operational_manager";
  
  // === PERMISSION UPDATE ===
  const canManageDocuments = (isSuperAdmin || isHRD || isOperationalManager) && !viewAsKaryawan;
  
  const canSeeStats = canManageDocuments;

  // === FETCH DATA ===
  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      let endpoint = "/api/dokumen/my-dokumen"; // Default (Karyawan / ViewAsKaryawan)
      
      if (canManageDocuments) {
        if (isSuperAdmin) {
          endpoint = "/api/dokumen/admin/all"; 
        } else if (isHRD || isOperationalManager) {
          endpoint = "/api/dokumen/manager/all"; 
        }
      }

      const res = await axios.get(endpoint);
      
      // Sort: Terbaru di atas
      const sortedData = res.data.sort((a, b) => 
        new Date(b.tanggalUnggah) - new Date(a.tanggalUnggah)
      );
      
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

    // Jika sedang mode "View As Karyawan", kembalikan semua data (karena endpoint sudah difilter /my-dokumen)
    if (viewAsKaryawan) return dokumenList;

    let filtered = [...dokumenList];

    // Super Admin bisa lihat semua dokumen
    if (isSuperAdmin) {
      return filtered;
    }

    // HRD hanya bisa lihat dokumen Pribadi & Surat Ijin
    if (isHRD) {
      filtered = filtered.filter(doc => 
        ["Pribadi", "Surat Ijin", "Surat"].includes(doc.jenisDokumen)
      );
    }
    
    // Operational Manager hanya bisa lihat Proposal & Laporan
    if (isOperationalManager) {
      filtered = filtered.filter(doc => 
        ["Proposal", "Laporan"].includes(doc.jenisDokumen)
      );
    }

    return filtered;
  }, [dokumenList, user, isSuperAdmin, isHRD, isOperationalManager, viewAsKaryawan]);

  const typeOptions = useMemo(() => {
    if (viewAsKaryawan) {
        const uniqueTypes = [...new Set(accessibleDocuments.map(d => d.jenisDokumen).filter(Boolean))];
        return ["Semua", ...uniqueTypes];
    }

    if (isSuperAdmin) {
      const uniqueTypes = [...new Set(accessibleDocuments.map(d => d.jenisDokumen).filter(Boolean))];
      return ["Semua", ...uniqueTypes];
    }

    if (isHRD) {
      return ["Semua", "Pribadi", "Surat Ijin"];
    }
    
    if (isOperationalManager) {
      return ["Semua", "Proposal", "Laporan"];
    }

    const uniqueTypes = [...new Set(accessibleDocuments.map(d => d.jenisDokumen).filter(Boolean))];
    return ["Semua", ...uniqueTypes];
  }, [user, accessibleDocuments, isSuperAdmin, isHRD, isOperationalManager, viewAsKaryawan]);

  const filteredList = filterDocuments(accessibleDocuments, searchTerm, filterStatus, filterType);

  // === STATISTICS ===
  const stats = useMemo(() => ({
    total: accessibleDocuments.length,
    pending: accessibleDocuments.filter(d => d.status === "Menunggu Persetujuan").length,
    approved: accessibleDocuments.filter(d => d.status === "Disetujui").length,
    rejected: accessibleDocuments.filter(d => d.status === "Ditolak").length,
  }), [accessibleDocuments]);

  // === PERMISSION CHECKS ===
  const canApproveReject = (doc) => {

    if (!user || !doc || viewAsKaryawan) return false;
    
    if (isSuperAdmin) return true;
    
    if (isHRD) {
      return ["Pribadi", "Surat Ijin"].includes(doc.jenisDokumen);
    }
    
    if (isOperationalManager) {
      return ["Proposal", "Laporan"].includes(doc.jenisDokumen);
    }
    
    return false;
  };

  // === ACTIONS ===
  const handleUpdateStatus = async (docId, newStatus, docTitle) => {
    if (!canManageDocuments) return; 

    setActionLoading(docId);
    try {
      const endpoint = isSuperAdmin 
        ? `/api/dokumen/admin/status/${docId}`
        : `/api/dokumen/manager/status/${docId}`;

      await axios.put(endpoint, { status: newStatus });

      setDokumenList((prev) =>
        prev.map((doc) =>
          doc._id === docId ? { ...doc, status: newStatus } : doc
        )
      );

      setSuccessModal({
        isOpen: true,
        type: newStatus === "Disetujui" ? "approve" : "reject",
        docName: docTitle || "Dokumen"
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.msg || "Gagal mengubah status dokumen");
    } finally {
      setActionLoading(null);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, type: "", docName: "" });
  };

  const handleDownload = async (doc) => {
    await downloadDocument(doc._id, doc.judul);
  };

  // === RENDER ===
  return (
    <div className="dokumen-list-container">
      {/* STATS CARDS - Hanya untuk Manager/Admin */}
      {canSeeStats && (
        <div className="stats-grid">
          <StatsCard title="Total Dokumen" value={stats.total} colorClass="total" />
          <StatsCard title="Menunggu" value={stats.pending} colorClass="pending" />
          <StatsCard title="Disetujui" value={stats.approved} colorClass="approved" />
          <StatsCard title="Ditolak" value={stats.rejected} colorClass="rejected" />
        </div>
      )}

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
            {canManageDocuments
              ? "Tidak ada dokumen yang sesuai dengan akses Anda." 
              : "Anda belum mengunggah dokumen apapun."}
          </div>
        ) : ( 
          <table className="dokumen-table">
            <thead>
              <tr>
                <th>Dokumen</th>
                {/* Kolom Karyawan hilang jika View As Karyawan */}
                {canManageDocuments && <th>Karyawan</th>}
                <th>Tanggal</th>
                <th className="center col-status">Status</th>
                <th className="center col-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={canManageDocuments ? "5" : "4"} className="empty-row">
                    Tidak ditemukan dokumen yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((doc) => {
                  const statusProps = getStatusConfig(doc.status);
                  const isPending = doc.status === "Menunggu Persetujuan";
                  const isUpdating = actionLoading === doc._id;
                  const canApprove = canApproveReject(doc);
                  
                  const detailLink = canManageDocuments
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
                      {canManageDocuments && (
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
                          {/* Tombol Approve/Reject - Hilang jika View As Karyawan */}
                          {isPending && canApprove && !viewAsKaryawan && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(doc._id, "Disetujui", doc.judul)}
                                disabled={isUpdating}
                                title="Setujui"
                                className="btn-action approve"
                              >
                                <HiCheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(doc._id, "Ditolak", doc.judul)}
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
      {/* MODAL SUKSES (Pop-up) */}
      {successModal.isOpen && (
        <div className="approve-overlay">
          <div className="approve-content">
            {successModal.type === "approve" ? (
              <HiCheckCircle size={80} className="approve-icon-success" />
            ) : (
              <HiXCircle size={80} className="approve-icon-reject" />
            )}
            
            <h2 className="approve-title">
              {successModal.type === "approve" ? "Dokumen Disetujui!" : "Dokumen Ditolak!"}
            </h2>
            
            <p className="approve-desc">
              Dokumen <strong>"{successModal.docName}"</strong> berhasil {successModal.type === "approve" ? " Disetujui" : " Ditolak"}.
            </p>

            <div className="approve-buttons-single">
              <button className="btn btn-primary" onClick={closeSuccessModal}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DokumenList;
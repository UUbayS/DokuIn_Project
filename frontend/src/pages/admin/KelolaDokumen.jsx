// frontend/src/pages/admin/KelolaDokumen.jsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StatsCard from "../../components/statscard";
import DokumenList from "../../components/DokumenList";
import { HiDocumentText } from "react-icons/hi";
import "./KelolaDokumen.css"

const KelolaDokumen = () => {
  const { isAuthLoading, user } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      const isManager = ['hrd', 'operational_manager', 'Administrator'].includes(user?.role);
      const endpoint = isManager ? "/api/dokumen/admin/all" : "/api/dokumen/my-dokumen";
      const res = await axios.get(endpoint);  
      const sortedData = res.data.sort((a, b) => new Date(b.tanggalUnggah) - new Date(a.tanggalUnggah));
      
      setDataDokumen(sortedData);
      // Gunakan endpoint manager yang bisa diakses oleh Super Admin, HRD, dan Op. Manajer
      const res = await axios.get("/api/dokumen/manager/all");
      setDokumenList(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching:", err);
      setError(err.response?.data?.msg || "Gagal memuat dokumen");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchDokumen();
    }
  }, [isAuthLoading, user]);

  const filteredList = filterDocuments(dokumenList, searchTerm, filterStatus, filterType);

  const uniqueTypes = ["Semua", ...new Set(dokumenList.map(d => d.jenisDokumen).filter(Boolean))];

  const handleUpdateStatus = async (docId, newStatus) => {
    setActionLoading(docId);
    try {
      // Gunakan endpoint manager yang bisa diakses oleh semua manager roles
      await axios.put(`/api/dokumen/manager/status/${docId}`, { status: newStatus });

      // Update local state
      setDokumenList((prev) =>
        prev.map((doc) =>
          doc._id === docId ? { ...doc, status: newStatus } : doc
        )
      );
    }

    if (user.role === 'operational_manager') {
      return dataDokumen.filter(doc => 
        ['Proposal', 'Laporan'].includes(doc.jenisDokumen)
      );
    }

    return [];
  }, [dataDokumen, user]);

  const stats = {
    total: accessibleDocuments.length,
    pending: accessibleDocuments.filter(d => d.status === "Menunggu Persetujuan").length,
    approved: accessibleDocuments.filter(d => d.status === "Disetujui").length,
    rejected: accessibleDocuments.filter(d => d.status === "Ditolak").length,
  };

  const canSeeStats = ['Administrator', 'hrd', 'operational_manager'].includes(user?.role);

  return (
    <div className="kelola-dokumen-container">
      <h1 className="kelola-dokumen-header">
        <HiDocumentText size={28} className="text-blue-600" />
        Kelola Dokumen Karyawan
      </h1>

      {canSeeStats && (
        <div className="stats-grid">
          <StatsCard title="Total Dokumen" value={stats.total} colorClass="total" />
          <StatsCard title="Menunggu" value={stats.pending} colorClass="pending" />
          <StatsCard title="Disetujui" value={stats.approved} colorClass="approved" />
          <StatsCard title="Ditolak" value={stats.rejected} colorClass="rejected" />
        </div>
        <div style={{ padding: "15px 25px", background: "#fef3c7", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#92400e" }}>{totalPending}</div>
          <div style={{ color: "#92400e", fontSize: "14px" }}>Menunggu</div>
        </div>
        <div style={{ padding: "15px 25px", background: "#d1fae5", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#065f46" }}>{totalDisetujui}</div>
          <div style={{ color: "#065f46", fontSize: "14px" }}>Disetujui</div>
        </div>
        <div style={{ padding: "15px 25px", background: "#fee2e2", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderLeft: "4px solid #ef4444" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#991b1b" }}>{totalDitolak}</div>
          <div style={{ color: "#991b1b", fontSize: "14px" }}>Ditolak</div>
        </div>
      </div>
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
            <option value="Surat Ijin">Surat Ijin</option>
            <option value="Laporan">Laporan</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {isLoading || isAuthLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Memuat data...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>{error}</div>
        ) : dokumenList.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Belum ada dokumen.</div>
        ) : ( 
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#3b82f6", color: "white" }}>
              <tr>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Dokumen</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Karyawan</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Tanggal</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>Aksi</th>
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
                const statusProps = getStatusConfig(doc.status);
                const isPending = doc.status === "Menunggu Persetujuan";
                const isUpdating = actionLoading === doc._id;

                return (
                  <tr key={doc._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <HiDocumentText size={20} style={{ color: "#3b82f6" }} />
                        <div>
                          <div style={{ fontWeight: "600" }}>{doc.judul}</div>
                          {doc.deskripsi && (
                            <div style={{ fontSize: "12px", color: "#666" }}>{doc.deskripsi}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#666" }}>
                        <HiUser size={16} />
                        <span>{doc.karyawanId?.namaPengguna || "Unknown"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>
                      {new Date(doc.tanggalUnggah).toLocaleDateString("id-ID")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "5px",
                        padding: "4px 12px", 
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "500",
                        background: statusProps.colorClass === "status-disetujui" ? "#d1fae5" : 
                                   statusProps.colorClass === "status-ditolak" ? "#fee2e2" : 
                                   statusProps.colorClass === "status-pending" ? "#fef3c7" : "#f3f4f6",
                        color: statusProps.colorClass === "status-disetujui" ? "#065f46" : 
                               statusProps.colorClass === "status-ditolak" ? "#991b1b" : 
                               statusProps.colorClass === "status-pending" ? "#92400e" : "#374151"
                      }}>
                        {statusProps.icon}
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        {/* Tombol Approve/Reject untuk semua Manager roles */}
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(doc._id, "Disetujui")}
                              disabled={isUpdating}
                              style={{
                                padding: "8px 12px",
                                background: "#d1fae5",
                                color: "#065f46",
                                border: "none",
                                borderRadius: "6px",
                                cursor: isUpdating ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                opacity: isUpdating ? 0.5 : 1
                              }}
                              title="Setujui"
                            >
                              <HiCheckCircle size={16} /> Setujui
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(doc._id, "Ditolak")}
                              disabled={isUpdating}
                              style={{
                                padding: "8px 12px",
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "none",
                                borderRadius: "6px",
                                cursor: isUpdating ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                opacity: isUpdating ? 0.5 : 1
                              }}
                              title="Tolak"
                            >
                              <HiXCircle size={16} /> Tolak
                            </button>
                          </>
                        )}
                        <Link
                          to={`/dokumen/${doc._id}`}
                          style={{
                            padding: "8px 12px",
                            background: "#f3e8ff",
                            color: "#7c3aed",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            textDecoration: "none"
                          }}
                          title="Lihat Detail & Komentar"
                        >
                          <HiEye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDownload(doc)}
                          style={{
                            padding: "8px 12px",
                            background: "#e0f2fe",
                            color: "#0369a1",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                          title="Download"
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
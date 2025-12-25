// frontend/src/pages/admin/KelolaDokumen.jsx
// Halaman untuk Admin melihat semua dokumen dan melakukan approval/reject

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./KelolaDokumen.css";

import {
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiDownload,
  HiUser,
  HiEye,
} from "react-icons/hi";

const getStatusProps = (status) => {
  switch (status) {
    case "Disetujui":
      return {
        icon: <HiCheckCircle />,
        color: "status-green",
      };
    case "Ditolak":
      return {
        icon: <HiXCircle />,
        color: "status-red",
      };
    case "Menunggu Persetujuan":
      return {
        icon: <HiClock />,
        color: "status-yellow",
      };
    default:
      return {
        icon: null,
        color: "status-gray",
      };
  }
};

const KelolaDokumen = () => {
  const { isAuthLoading } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAllDokumen = async () => {
    setIsLoading(true);
    try {
      // axios sudah punya default header x-auth-token dari AuthContext
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

  const handleUpdateStatus = async (docId, newStatus) => {
    setActionLoading(docId);
    try {
      await axios.put(`/api/dokumen/admin/status/${docId}`, { status: newStatus });

      // Update local state
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

  const handleDownload = (docId) => {
    // Untuk download, kita perlu token di URL atau header
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/api/dokumen/download/${docId}?token=${token}`, "_blank");
  };

  // Stats
  const totalDokumen = dokumenList.length;
  const totalPending = dokumenList.filter(
    (d) => d.status === "Menunggu Persetujuan"
  ).length;
  const totalDisetujui = dokumenList.filter(
    (d) => d.status === "Disetujui"
  ).length;
  const totalDitolak = dokumenList.filter(
    (d) => d.status === "Ditolak"
  ).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <HiDocumentText size={28} />
        Kelola Dokumen Karyawan
      </h1>

      {/* Stats */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ padding: "15px 25px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderLeft: "4px solid #3b82f6" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>{totalDokumen}</div>
          <div style={{ color: "#666", fontSize: "14px" }}>Total</div>
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
              {dokumenList.map((doc) => {
                const statusProps = getStatusProps(doc.status);
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
                        background: statusProps.color === "status-green" ? "#d1fae5" : 
                                   statusProps.color === "status-red" ? "#fee2e2" : 
                                   statusProps.color === "status-yellow" ? "#fef3c7" : "#f3f4f6",
                        color: statusProps.color === "status-green" ? "#065f46" : 
                               statusProps.color === "status-red" ? "#991b1b" : 
                               statusProps.color === "status-yellow" ? "#92400e" : "#374151"
                      }}>
                        {statusProps.icon}
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
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
                          onClick={() => handleDownload(doc._id)}
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
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KelolaDokumen;

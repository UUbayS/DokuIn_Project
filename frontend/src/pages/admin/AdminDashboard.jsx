// frontend/src/pages/admin/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import {
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiArrowRight,
} from "react-icons/hi";

const AdminDashboard = () => {
  const { isAuthLoading, user } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllDokumen = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/dokumen/admin/all");
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
    if (!isAuthLoading) {
      fetchAllDokumen();
    }
  }, [isAuthLoading]);

  const totalDokumen = dokumenList.length;
  const totalDisetujui = dokumenList.filter((d) => d.status === "Disetujui").length;
  const totalPending = dokumenList.filter((d) => d.status === "Menunggu Persetujuan").length;
  const totalDitolak = dokumenList.filter((d) => d.status === "Ditolak").length;

  const pendingDocs = dokumenList
    .filter((d) => d.status === "Menunggu Persetujuan")
    .slice(0, 5);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>
        Selamat Datang, {user ? user.namaPengguna : "Admin"}!
      </h1>

      {/* Stats */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ padding: "20px 30px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", minWidth: "150px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>{totalDokumen}</div>
          <div style={{ color: "#666" }}>Total Dokumen</div>
        </div>
        <div style={{ padding: "20px 30px", background: "#fef3c7", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", minWidth: "150px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#92400e" }}>{totalPending}</div>
          <div style={{ color: "#92400e" }}>Menunggu</div>
        </div>
        <div style={{ padding: "20px 30px", background: "#d1fae5", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", minWidth: "150px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#065f46" }}>{totalDisetujui}</div>
          <div style={{ color: "#065f46" }}>Disetujui</div>
        </div>
        <div style={{ padding: "20px 30px", background: "#fee2e2", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", minWidth: "150px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#991b1b" }}>{totalDitolak}</div>
          <div style={{ color: "#991b1b" }}>Ditolak</div>
        </div>
      </div>

      {/* Pending Documents */}
      <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ background: "#3b82f6", color: "white", padding: "15px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <HiClock size={20} />
          <span style={{ fontWeight: "600" }}>Dokumen Menunggu Persetujuan</span>
        </div>
        
        <div style={{ padding: "20px" }}>
          {isLoading || isAuthLoading ? (
            <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>Memuat data...</div>
          ) : error ? (
            <div style={{ textAlign: "center", color: "#dc2626", padding: "20px" }}>{error}</div>
          ) : pendingDocs.length === 0 ? (
            <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
              🎉 Tidak ada dokumen yang menunggu persetujuan.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {pendingDocs.map((doc) => (
                <li key={doc._id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "15px 0",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <HiDocumentText size={24} style={{ color: "#3b82f6" }} />
                    <div>
                      <div style={{ fontWeight: "600" }}>{doc.judul}</div>
                      <div style={{ fontSize: "13px", color: "#666" }}>
                        {doc.karyawanId?.namaPengguna || "Unknown"} • {new Date(doc.tanggalUnggah).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <span style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 12px", 
                    background: "#fef3c7", 
                    color: "#92400e",
                    borderRadius: "20px",
                    fontSize: "13px"
                  }}>
                    <HiClock size={14} />
                    Menunggu
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ padding: "15px 20px", borderTop: "1px solid #e5e7eb", textAlign: "right" }}>
          <Link to="/admin/kelola-dokumen" style={{ 
            color: "#3b82f6", 
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}>
            Kelola Semua Dokumen <HiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// frontend/src/pages/admin/AdminDashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import StatsCard from "../../components/statscard";

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

  const pendingDocs = accessibleDocuments
    .filter((d) => d.status === "Menunggu Persetujuan")
    .slice(0, 5);

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-header">
        Selamat Datang, {user ? user.namaPengguna : "Admin"}!
      </h1>

      {/* Stats Grid */}
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

      {/* Pending Documents */}
      <div className="recent-docs-container">
        <div className="recent-docs-header">
          <HiClock size={20} />
          <span className="recent-docs-title">Dokumen Menunggu Persetujuan</span>
        </div>
        
        <div className="recent-docs-body">
          {isLoading || isAuthLoading ? (
            <div className="list-message loading">Memuat data...</div>
          ) : error ? (
            <div className="list-message error">{error}</div>
          ) : pendingDocs.length === 0 ? (
            <div className="list-message empty">
              🎉 Tidak ada dokumen yang menunggu persetujuan.
            </div>
          ) : (
            <ul className="recent-docs-list">
              {pendingDocs.map((doc) => (
                <li key={doc._id} className="recent-doc-item">
                  <div className="doc-info">
                    <HiDocumentText size={24} className="doc-info-icon" />
                    <div className="doc-info-text">
                      <div className="doc-info-name">{doc.judul}</div>
                      <div className="doc-info-meta">
                        {doc.karyawanId?.namaPengguna || "Unknown"} • {new Date(doc.tanggalUnggah).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <span className="doc-status pending">
                    <HiClock size={14} className="doc-status-icon" />
                    Menunggu
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="recent-docs-footer">
          <Link to="/admin/kelola-dokumen" className="recent-docs-footer-link">
            Kelola Semua Dokumen <HiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
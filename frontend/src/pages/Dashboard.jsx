// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/statsCard";
import "./Dashboard.css"

import { getStatusConfig } from "../utils/statusHelper";
import { formatDate } from "../utils/dateHelper";

import {
  HiDocumentText
} from "react-icons/hi";

const Dashboard = () => {
  const { isAuthLoading, user } = useAuth();
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/dokumen/my-dokumen");
      setDokumenList(res.data);
      setError("");
    } catch (err) {
      setError("Gagal memuat dokumen");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchDokumen();
    }
  }, [isAuthLoading]);

  const totalDokumen = dokumenList.length;
  const totalDisetujui = dokumenList.filter(
    (d) => d.status === "Disetujui"
  ).length;
  const totalPending = dokumenList.filter(
    (d) => d.status === "Menunggu Persetujuan"
  ).length;
  const totalDitolak = dokumenList.filter(
    (d) => d.status === "Ditolak"
  ).length;

  const dokumenTerbaru = dokumenList.slice(0, 3);



  return (
    <>
      <h1 className="main-content-title">Selamat Datang, {user ? user.namaPengguna : "Username"}!</h1>

      <div className="stats-grid">
        <StatsCard
          title="Total Dokumen:"
          value={totalDokumen}
          colorClass="card-white"
        />
        <StatsCard
          title="Disetujui"
          value={totalDisetujui}
          colorClass="card-green"
        />
        <StatsCard
          title="Menunggu Persetujuan"
          value={totalPending}
          colorClass="card-yellow"
        />
        <StatsCard
          title="Ditolak"
          value={totalDitolak}
          colorClass="card-red"
        />
      </div>

      <div className="recent-docs-container">
        <div className="recent-docs-header">
          <span className="recent-docs-title">Dokumen Terbaru</span>
          <span className="recent-docs-status-header">Status</span>
        </div>
        <div className="recent-docs-list">
          {isLoading || isAuthLoading ? (
            <div className="list-message">Memuat data...</div>
          ) : error ? (
            <div className="list-message error">{error}</div>
          ) : dokumenTerbaru.length === 0 ? (
            <div className="list-message">Belum ada dokumen.</div>
          ) : (
            <ul>
              {dokumenTerbaru.map((doc) => {
                const statusProps = getStatusConfig(doc.status);
                return (
                  <li key={doc._id} className="recent-doc-item">
                    <div className="doc-info">
                      <HiDocumentText size={24} className="doc-info-icon" />
                      <div>
                        <div className="doc-info-name">
                          {doc.judul || doc.namaFile || "Nama Dokumen"}
                        </div>
                        <div className="doc-info-date">
                          {new Date(
                            doc.tanggalUnggah
                          ).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                    </div>
                    <div className={`doc-status ${statusProps.colorClass}`}>
                      <span>{doc.status}</span>
                      <span className="doc-status-icon">
                        {statusProps.icon}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="recent-docs-footer">
          <a href="/riwayat-dokumen">Tampilkan Semua &rarr;</a>
        </div>
      </div>
    </>
  );
};

export default Dashboard;


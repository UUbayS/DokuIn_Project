// frontend/src/pages/admin/KelolaDokumen.jsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StatsCard from "../../components/statscard";
import DokumenList from "../../components/DokumenList";
import { HiDocumentText } from "react-icons/hi";
import "./KelolaDokumen.css"

const KelolaDokumen = () => {
  const { user, isAuthLoading } = useAuth();
  const [dataDokumen, setDataDokumen] = useState([]); // State data disimpan disini
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

  const accessibleDocuments = useMemo(() => {
    if (!user || dataDokumen.length === 0) return [];

    if (user.role === 'Administrator') {
      return dataDokumen;
    }

    if (user.role === 'hrd') {
      return dataDokumen.filter(doc => 
        ['Pribadi', 'Surat', 'Surat Izin'].includes(doc.jenisDokumen)
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
      )}

      <DokumenList 
        data={accessibleDocuments} 
        isLoading={isLoading} 
        error={error} 
        refreshData={fetchDokumen}
      />
    </div>
  );
};

export default KelolaDokumen;
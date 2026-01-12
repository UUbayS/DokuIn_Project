// frontend/src/pages/admin/KelolaDokumen.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext";
import DokumenList from "../../components/DokumenList";
import { HiDocumentText } from "react-icons/hi";
import "./KelolaDokumen.css";

const KelolaDokumen = () => {
  const { user } = useAuth();

  return (
    <div className="kelola-dokumen-container">
      <h1 className="kelola-dokumen-header">
        <HiDocumentText size={28} className="text-blue-600" />
        Kelola Dokumen
      </h1>
      <DokumenList />
    </div>
  );
};

export default KelolaDokumen;
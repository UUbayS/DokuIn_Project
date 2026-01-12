// frontend/src/pages/RiwayatDokumen.jsx

import DokumenList from "../components/DokumenList";
import "./RiwayatDokumen.css"; 
import { HiDocumentText } from "react-icons/hi";

const RiwayatDokumen = () => {

  return (
    <div className="riwayat-page-container">
      <h1 className="riwayat-page-header">
        <HiDocumentText size={28} className="text-blue-600" />
        Riwayat Dokumen
      </h1>
      <DokumenList />
    </div>
  );
};

export default RiwayatDokumen;
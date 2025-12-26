import React from "react";
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiClock // Menggunakan HiClock sesuai request Anda
} from "react-icons/hi";

/**
 * Helper untuk mendapatkan konfigurasi tampilan berdasarkan status dokumen.
 * Digunakan di: RiwayatDokumen, DetailDokumen, Dashboard, KelolaDokumen (Admin)
 */
export const getStatusConfig = (status) => {
  switch (status) {
    case "Disetujui":
      return {
        icon: <HiCheckCircle size={18} />, 
        colorClass: "status-disetujui", 
        label: "Disetujui"
      };
      
    case "Ditolak":
      return {
        icon: <HiXCircle size={18} />, 
        colorClass: "status-ditolak", 
        label: "Ditolak"
      };
      
    case "Menunggu Persetujuan":
      return {
        icon: <HiClock size={18} />,
        colorClass: "status-pending", 
        label: "Menunggu Persetujuan"
      };
      
    default:
      return {
        icon: null, 
        colorClass: "status-gray",
        label: status || "Unknown"
      };
  }
};
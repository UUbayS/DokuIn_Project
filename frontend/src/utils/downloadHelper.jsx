// frontend/src/utils/downloadHelper.js
import axios from "axios";

// Sesuaikan URL backend Anda. 
// Bisa hardcode atau ambil dari environment variable (process.env.REACT_APP_API_URL)
const BACKEND_URL = "http://localhost:5000";

/**
 * Fungsi untuk mendownload dokumen
 * @param {string} docId - ID Dokumen (_id)
 * @param {string} docTitle - Judul Dokumen (untuk nama file)
 * @returns {Promise<boolean>} - True jika sukses, False jika gagal
 */
export const downloadDocument = async (docId, docTitle) => {
  try {
    const response = await axios({
      url: `${BACKEND_URL}/api/dokumen/download/${docId}`,
      method: "GET",
      responseType: "blob", // PENTING: Response harus blob
      headers: {
        "x-auth-token": localStorage.getItem("token"), // Ambil token dari storage
      },
    });

    // 1. Buat URL virtual dari data Blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // 2. Tentukan nama file
    // Cek apakah judul sudah ada ekstensi .pdf, jika belum tambahkan
    const filename = docTitle.toLowerCase().endsWith(".pdf") 
      ? docTitle 
      : `${docTitle}.pdf`;
      
    link.setAttribute("download", filename);

    // 3. Trigger download
    document.body.appendChild(link);
    link.click();

    // 4. Bersihkan memori
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true; // Berhasil
  } catch (error) {
    console.error("Download error:", error);
    alert("Gagal mendownload file. Kemungkinan file fisik hilang atau token expired.");
    return false; // Gagal
  }
};
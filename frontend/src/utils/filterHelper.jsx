// frontend/src/utils/filterHelper.js

/**
 * Memfilter dokumen berdasarkan Search, Status, dan Jenis Dokumen
 * @param {Array} data - Data asli
 * @param {String} searchTerm - Keyword pencarian
 * @param {String} filterStatus - Status (Semua, Disetujui, dll)
 * @param {String} filterType - Jenis Dokumen (Semua, Laporan, Surat, dll)
 * @returns {Array} - Data hasil filter
 */
export const filterDocuments = (data, searchTerm, filterStatus, filterType) => {
  if (!data) return [];

  return data.filter((doc) => {
    // 1. Search (Nama Dokumen)
    const matchSearch = doc.judul?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Filter Status
    const matchStatus = filterStatus === "Semua" || doc.status === filterStatus;

    // 3. Filter Jenis Dokumen (BARU)
    const matchType = filterType === "Semua" || doc.jenisDokumen === filterType;

    // Return true jika KETIGANYA cocok
    return matchSearch && matchStatus && matchType;
  });
};
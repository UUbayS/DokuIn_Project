// Mengubah ISO String menjadi format tanggal Indonesia (Contoh: 25 Desember 2025)
export const formatDate = (isoString) => {
  if (!isoString) return "-";
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  }).format(new Date(isoString));
};

// Mengubah ISO String menjadi format tanggal & jam (Contoh: 25 Desember 2025, 14.30 WIB)
export const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short'
  }).format(new Date(isoString));
};
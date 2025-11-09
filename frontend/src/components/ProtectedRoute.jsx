// frontend/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Komponen ini akan "membungkus" halaman yang ingin kita proteksi
const ProtectedRoute = ({ children }) => {
  // 1. Ambil status autentikasi dari AuthContext
  const { isAuthenticated } = useAuth();

  // 2. Cek statusnya
  if (!isAuthenticated) {
   
    return <Navigate to="/login" replace />;
  }

  // 4. Jika SUDAH login, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;

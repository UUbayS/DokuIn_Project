// frontend/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Komponen ini akan "membungkus" halaman yang ingin kita proteksi
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Jika belum login, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika admin mengakses halaman karyawan (/) dan bukan dari admin yang sengaja mau lihat
  // Kita biarkan admin bisa akses halaman karyawan jika mau (untuk flexibility)
  // Cek apakah ada flag di localStorage yang menandakan admin mau lihat sebagai karyawan
  const viewAsKaryawan = localStorage.getItem("viewAsKaryawan") === "true";
  
  if (user?.role === "Administrator" && !viewAsKaryawan && location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

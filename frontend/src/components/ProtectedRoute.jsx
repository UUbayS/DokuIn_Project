// frontend/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Manager roles yang redirect ke halaman admin
const MANAGER_ROLES = ["Super Admin", "HRD", "Operasional Manajer"];

// Komponen ini akan "membungkus" halaman yang ingin kita proteksi
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Jika belum login, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika manager role mengakses halaman karyawan (/) dan bukan dari admin yang sengaja mau lihat
  // Kita biarkan manager bisa akses halaman karyawan jika mau (untuk flexibility)
  // Cek apakah ada flag di localStorage yang menandakan admin mau lihat sebagai karyawan
  const viewAsKaryawan = localStorage.getItem("viewAsKaryawan") === "true";
  
  if (MANAGER_ROLES.includes(user?.role) && !viewAsKaryawan && location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;


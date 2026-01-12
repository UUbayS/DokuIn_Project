import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Roles yang diizinkan masuk halaman admin
const MANAGER_ROLES = ["Super Admin", "HRD", "Operasional Manajer"];

const AdminRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Cek Role: Harus salah satu dari manager roles
  if (!MANAGER_ROLES.includes(user?.role)) {
    // Jika Karyawan coba masuk halaman admin, kembalikan ke dashboard biasa
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
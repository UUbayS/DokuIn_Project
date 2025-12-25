import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Cek Role: Harus "Administrator"
  if (user?.role !== "Administrator") {
    // Jika Karyawan coba masuk halaman admin, kembalikan ke dashboard biasa
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
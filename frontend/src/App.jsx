// frontend/src/App.jsx

import { Routes, Route,  Navigate} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout"; 
import UploadDokumen from "./pages/UploadDokumen";
import RiwayatDokumen from "./pages/RiwayatDokumen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import AdminLayout from "./pages/admin/AdminLayout";      
import AdminRoute from "./components/AdminRoute";

// 1. IMPORT HALAMAN BARU
import DetailDokumen from "./pages/DetailDokumen";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="upload-dokumen" element={<UploadDokumen />} />
        <Route path="riwayat-dokumen" element={<RiwayatDokumen />} />
        <Route path="dokumen/:id" element={<DetailDokumen />} />
      </Route>

      {/* --- JALUR ADMINISTRATOR --- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
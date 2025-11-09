// frontend/src/App.jsx

import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // 1. Import "penjaga" kita
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="container">
      <Routes>
        {/* === RUTE PUBLIK === */}
        {/* Siapapun bisa mengakses ini */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


      </Routes>
    </div>
  );
}


export default App;

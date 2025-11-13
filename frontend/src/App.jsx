// frontend/src/App.jsx

import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout"; // Asumsi ini adalah file wrapper Anda
import UploadDokumen from "./pages/UploadDokumen";
import RiwayatDokumen from "./pages/RiwayatDokumen";
import ProtectedRoute from "./components/ProtectedRoute";

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
        
        {/* 2. TAMBAHKAN RUTE BARU DI SINI */}
        <Route path="dokumen/:id" element={<DetailDokumen />} />
      </Route>
    </Routes>
  );
}

export default App;

// // frontend/src/App.jsx

// import { Routes, Route } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Layout from "./pages/Layout";
// import UploadDokumen from "./pages/UploadDokumen";
// import RiwayatDokumen from "./pages/RiwayatDokumen";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <Routes>
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />

//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Dashboard />} />
//           <Route path="upload-dokumen" element={<UploadDokumen />} />
//         {<Route path="riwayat-dokumen" element={<RiwayatDokumen />} />}
//       </Route>
//     </Routes>
//   );
// }

// export default App;
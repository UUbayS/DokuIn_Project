import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"; // 1. Import Halaman Login

// Placeholder untuk halaman setelah login
const Dashboard = () => <h1>Selamat Datang di Dashboard!</h1>;

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* 2. Tambahkan rute untuk login */}
        <Route path="/login" element={<Login />} />
        {/* 3. Tambahkan rute untuk dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Nanti kita atur halaman utama (/) */}
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

// Pastikan 3 import ini ada
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register"; // Pastikan path ini benar!

function App() {
  return (
    // Jika Anda tidak melihat apa-apa, mungkin div ini tidak ada
    <div className="container">
      <Routes>
        {/* Rute ini yang seharusnya me-render halaman Anda */}
        <Route path="/register" element={<Register />} />

        {/* Tambahkan rute ini untuk testing */}
        <Route path="/" element={<h1>Ini Halaman Home</h1>} />
      </Routes>
    </div>
  );
}

export default App;

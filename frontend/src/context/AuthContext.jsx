// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Provider (Komponen yang akan membungkus App)
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  // '!!' mengubah string (jika ada) menjadi true, atau null/undefined menjadi false

  // Efek ini akan mengecek local storage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // Atur header default axios agar setiap request menyertakan token
      axios.defaults.headers.common["x-auth-token"] = storedToken;
    }
  }, []);

  // Fungsi untuk LOGIN
  const login = async (namaPengguna, kataSandi) => {
    try {
      const res = await axios.post("/api/auth/login", { namaPengguna, kataSandi });
      const { token } = res.data;

      // Simpan token ke local storage
      localStorage.setItem("token", token);
      // Simpan ke state
      setToken(token);
      setIsAuthenticated(true);
      // Atur header default axios
      axios.defaults.headers.common["x-auth-token"] = token;
    } catch (err) {
      // Jika gagal, hapus sisa token lama (jika ada)
      logout();
      // Lempar error agar komponen Login bisa menangkapnya
      throw new Error(err.response.data.msg || "Login Gagal");
    }
  };

  // Fungsi untuk LOGOUT (Use Case #3)
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Buat Hook kustom agar mudah digunakan
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;

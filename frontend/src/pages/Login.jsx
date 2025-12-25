// Login.jsx

import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import DokuInIcon from "../assets/DokuIn_Icon.svg";
import DokuInLogo from "../assets/DokuIn_Logo.svg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPengguna: "",
    kataSandi: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await login(formData.namaPengguna, formData.kataSandi);
      
      // Cek role dari localStorage (sudah disimpan oleh login function)
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.role === "Administrator") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.message || "Login gagal. Periksa kembali data Anda.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      padding: "40px 20px" 
    }}>
      
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "80px",
        padding: "0 40px"
      }}>
        
        {/* Konten Kiri (Logo) - Ukuran Lebih Besar */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "24px",
          flex: "0 0 auto"
        }}>
          <img 
            src={DokuInIcon} 
            alt="DokuIn Icon" 
            style={{
              width: "120px", 
              height: "120px"
            }} 
          />
          <img 
            src={DokuInLogo} 
            alt="DokuIn" 
            style={{
              height: "80px"
            }} 
          />
        </div>

        {/* Konten Kanan (Form) */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "40px 50px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "480px",
          flexShrink: 0,
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px"
          }}>Login</h2>

          {message && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{message}</div>}

          {/* Form Fields */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Username</label>
            <input
              type="text"
              name="namaPengguna"
              value={formData.namaPengguna}
              onChange={onChange}
              placeholder="Username"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="kataSandi"
                value={formData.kataSandi}
                onChange={onChange}
                placeholder="Password"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  paddingRight: "48px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "#6b7280"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={onSubmit}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#000",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
// Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import DokuInIcon from "../assets/DokuIn_Icon.svg";
import DokuInLogo from "../assets/DokuIn_Logo.svg";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPengguna: "",
    email: "",
    kataSandi: "",
    kataSandi2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0"; 
    document.body.style.display = "block"; 
    document.body.style.minHeight = "auto"; 
    document.body.style.overflowX = "hidden"; 
    document.body.style.backgroundColor = "#f5f5f5"; 

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.display = "";
      document.body.style.minHeight = "";
      document.body.style.overflowX = "";
      document.body.style.backgroundColor = "";
    };
  }, []); 

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.kataSandi !== formData.kataSandi2) {
      setMessage("Password dan Re-Confirm Password tidak cocok");
      return;
    }
    try {
      const newUser = {
        namaPengguna: formData.namaPengguna,
        email: formData.email,
        kataSandi: formData.kataSandi,
      };
      await axios.post("/api/auth/register", newUser); 
      setShowPopup(true);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Registrasi gagal. Coba lagi.");
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

        {/* Form */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "40px 50px", 
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "480px",
          flexShrink: 0,
        }}>
          {/* Navigasi */}
          <div style={{
            backgroundColor: "#2563EB",
            borderRadius: "12px",
            padding: "6px",
            display: "flex",
            marginBottom: "32px"
          }}>
            <Link to="/login" style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center",
              textDecoration: "none"
            }}>Log In</Link>
            <div style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "white",
              color: "#2563EB",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center"
            }}>Register</div>
          </div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px"
          }}>Register Account</h2>
          
          {message && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{message}</div>}
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Username</label>
            <input
              type="text"
              name="namaPengguna"
              value={formData.namaPengguna}
              onChange={onChange}
              placeholder="username"
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
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="example@gmail.com"
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
          <div style={{ marginBottom: "16px" }}>
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
          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="kataSandi2"
                value={formData.kataSandi2}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
          >Sign up</button>
        </div>
      </div>

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "48px 40px",
            textAlign: "center",
            maxWidth: "420px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>Register Account</h2>
            <p style={{ fontSize: "16px", color: "#666", marginBottom: "32px" }}>Your Account has been registered</p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 48px",
                backgroundColor: "#000",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
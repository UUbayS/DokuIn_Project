// frontend/src/pages/Login.jsx

import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import DokuInIcon from "../assets/DokuIn_Icon.svg";
import DokuInLogo from "../assets/DokuIn_Logo.svg";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    namaPengguna: "",
    kataSandi: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user types
    if (message) setMessage("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // Basic validation
    if (!formData.namaPengguna.trim() || !formData.kataSandi) {
      setMessage("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.namaPengguna, formData.kataSandi);
      
      // Check role from localStorage (already saved by login function)
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.role === "Administrator") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.message || "Login gagal. Periksa kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        
        {/* Left Section - Logo */}
        <div className="login-logo-section">
          <img 
            src={DokuInIcon} 
            alt="DokuIn Icon" 
            className="login-logo-icon"
          />
          <img 
            src={DokuInLogo} 
            alt="DokuIn" 
            className="login-logo-text"
          />
        </div>

        {/* Right Section - Form */}
        <div className="login-form-card">
          <h2 className="login-form-title">Login</h2>

          {/* Error Message */}
          {message && (
            <div className="login-error-message">
              {message}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={onSubmit}>
            {/* Username Field */}
            <div className="login-form-group">
              <label htmlFor="namaPengguna" className="login-form-label">
                Username
              </label>
              <input
                type="text"
                id="namaPengguna"
                name="namaPengguna"
                value={formData.namaPengguna}
                onChange={onChange}
                placeholder="Username"
                className="login-form-input"
                disabled={isLoading}
                required
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="login-form-group">
              <label htmlFor="kataSandi" className="login-form-label">
                Password
              </label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="kataSandi"
                  name="kataSandi"
                  value={formData.kataSandi}
                  onChange={onChange}
                  placeholder="Password"
                  className="login-form-input login-password-input"
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
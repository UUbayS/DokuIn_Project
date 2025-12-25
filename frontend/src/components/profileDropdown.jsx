// frontend/src/components/ProfileDropdown.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLogout, HiSwitchHorizontal, HiUserCircle, HiShieldCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import "./profileDropdown.css";

const ProfileDropdown = ({ onLogout, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = user?.role === "Administrator";
  const viewAsKaryawan = localStorage.getItem("viewAsKaryawan") === "true";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSwitchToAdmin = () => {
    localStorage.removeItem("viewAsKaryawan");
    navigate("/admin");
    onClose();
  };

  const handleSwitchToKaryawan = () => {
    localStorage.setItem("viewAsKaryawan", "true");
    navigate("/");
    onClose();
  };

  return (
    <div className="dropdown-menu profile-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <span style={{ fontWeight: "600", color: "#374151" }}>
          {user?.namaPengguna || "User"}
        </span>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>
          {user?.role || "Karyawan"}
        </span>
      </div>
      <div className="dropdown-content">
        {/* Switch options for Admin only */}
        {isAdmin && (
          <>
            {viewAsKaryawan ? (
              <button onClick={handleSwitchToAdmin} className="dropdown-item">
                <HiShieldCheck />
                <span>Halaman Admin</span>
              </button>
            ) : (
              <button onClick={handleSwitchToKaryawan} className="dropdown-item">
                <HiUserCircle />
                <span>Lihat Sbg Karyawan</span>
              </button>
            )}
            <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 0" }}></div>
          </>
        )}
        
        <button onClick={onLogout} className="dropdown-item dropdown-item-logout">
          <HiLogout />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
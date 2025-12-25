// frontend/src/components/ProfileDropdown.jsx

import React, { useEffect, useRef } from 'react';
import { HiCog, HiLogout } from 'react-icons/hi';
import "./profileDropdown.css";

const ProfileDropdown = ({ onLogout,  onClose }) => {
  const dropdownRef = useRef(null); 
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

  return (
    <div className="dropdown-menu profile-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
      </div>
      <div className="dropdown-content">
        <button onClick={onLogout} className="dropdown-item dropdown-item-logout">
        <HiLogout />
        <span>Log Out</span>
      </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
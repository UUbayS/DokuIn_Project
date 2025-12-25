// frontend/src/components/NotificationDropdown.jsx

import "./notificationDropdown.css"
import React, { useEffect, useRef } from 'react';

const NotificationDropdown = ({ onClose }) => {
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
    <div className="dropdown-menu notification-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        Notifikasi
      </div>
      <div className="dropdown-content-empty">
        Tidak ada notifikasi baru.
      </div>
    </div>
  );
};

export default NotificationDropdown;
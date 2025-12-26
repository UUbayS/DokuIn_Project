// frontend/src/components/Header.jsx

import { HiBell, HiUserCircle } from 'react-icons/hi';
import DokuInIcon from "../assets/DokuIn_Icon.svg"; 
import DokuInLogo from "../assets/DokuIn_Logo.svg"; 
import "./header.css"
import { useState, useEffect } from 'react';
import axios from 'axios';

const Header = ({ onToggleProfile, onToggleNotify }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { 'x-auth-token': token }
        });
        
        // Hitung yang belum dibaca
        const count = res.data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (err) {
        console.error("Failed to fetch notifications count", err);
      }
    };

    fetchUnreadCount();
    
    // Opsional: Polling setiap 30 detik untuk update notifikasi realtime sederhana
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <div style={{ 
          display: "flex", 
          backgroundColor: "#ffffff",
          alignItems: "center", 
          gap: "24px",
          flex: "0 0 auto",
        }}>
          <img 
            src={DokuInIcon} 
            alt="DokuIn Icon" 
            style={{
              width: "48px", 
              height: "48px"
            }} 
          />
          <img 
            src={DokuInLogo} 
            alt="DokuIn" 
            style={{
              height: "48px"
            }} 
          />
      </div>
      </div>
      <div className="header-icons">
        <button onClick={(e) => {
          onToggleNotify(e);
          // Opsional: Reset notification count saat dibuka, atau biarkan sampai dibaca satu-satu
        }} className="header-icon-btn">
          <HiBell size={22} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
        <button onClick={(e) => onToggleProfile(e)} className="header-icon-btn">
          <HiUserCircle size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;

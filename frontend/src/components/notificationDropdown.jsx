// frontend/src/components/NotificationDropdown.jsx

import "./notificationDropdown.css"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ onClose }) => {
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

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

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          'x-auth-token': token
        }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Gagal mengambil notifikasi", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      // Mark as read if not already
      if (!notif.isRead) {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/notifications/${notif._id}/read`, {}, {
          headers: {
            'x-auth-token': token
          }
        });
        // Update local state
        setNotifications(notifications.map(n => 
          n._id === notif._id ? { ...n, isRead: true } : n
        ));
      }

      // Navigate based on type
      if (notif.documentId) {
        // Jika perlu redirect ke detail dokumen
        // navigate(`/dokumen/${notif.documentId}`); 
        // Untuk sekarang mungkin navigate ke dashboard atau refresh
      }
      
    } catch (err) {
      console.error("Error clicking notification", err);
    }
  };

  return (
    <div className="dropdown-menu notification-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        Notifikasi
      </div>
      {notifications.length === 0 ? (
        <div className="dropdown-content-empty">
          Tidak ada notifikasi baru.
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="notification-item-title">
                {notif.type === 'NEW_DOCUMENT' && 'Dokumen Baru'}
                {notif.type === 'APPROVED' && 'Dokumen Disetujui'}
                {notif.type === 'REJECTED' && 'Dokumen Ditolak'}
                {notif.type === 'NEW_COMMENT' && 'Komentar Baru'}
              </div>
              <div className="notification-item-desc">
                {notif.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
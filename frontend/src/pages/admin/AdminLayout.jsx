// frontend/src/components/Layout.jsx

import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css"

import Sidebar from "../../components/sidebar";
import Header from "../../components/header"; 
import ProfileDropdown from "../../components/profileDropdown";
import NotificationDropdown from "../../components/notificationDropdown";

const AdminLayout = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifyOpen(false);
  };

  const toggleNotify = () => {
    setIsNotifyOpen(!isNotifyOpen);
    setIsProfileOpen(false);
  };

  return (
    <div className="new-layout-container">
      <Header 
        onToggleProfile={toggleProfile} 
        onToggleNotify={toggleNotify} 
      />
      
      {isProfileOpen && <ProfileDropdown onLogout={handleLogout} />}
      {isNotifyOpen && <NotificationDropdown />}

      <div className="main-body-container">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
// frontend/src/components/NotificationDropdown.jsx

import "./notificationDropdown.css"

const NotificationDropdown = () => {
  return (
    <div className="dropdown-menu notification-dropdown">
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
// frontend/src/components/ProfileDropdown.jsx

import { HiCog, HiLogout } from 'react-icons/hi';
import "./profileDropdown.css";

const ProfileDropdown = ({ onLogout }) => {
  return (
    <div className="dropdown-menu profile-dropdown">
      <a href="#" className="dropdown-item">
        <HiCog />
        <span>Pengaturan</span>
      </a>
      <button onClick={onLogout} className="dropdown-item dropdown-item-logout">
        <HiLogout />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
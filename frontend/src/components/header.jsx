// frontend/src/components/Header.jsx

import { HiBell, HiUserCircle } from 'react-icons/hi';
import DokuInIcon from "../assets/DokuIn_Icon.svg"; 
import DokuInLogo from "../assets/DokuIn_Logo.svg"; 
import "./header.css"

const Header = ({ onToggleProfile, onToggleNotify }) => {
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
        <button onClick={(e) => onToggleNotify(e)} className="header-icon-btn">
          <HiBell size={22} />
        </button>
        <button onClick={(e) => onToggleProfile(e)} className="header-icon-btn">
          <HiUserCircle size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;

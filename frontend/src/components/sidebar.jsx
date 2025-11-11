// frontend/src/components/Sidebar.jsx

import { 
  HiChartPie, 
  HiUpload, 
  HiCollection, 
  HiUserCircle,
} from 'react-icons/hi';
import "./sidebar.css"
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <div className="sidebar"> 
      <div className="sidebar-profile">
        <HiUserCircle size={70} className="sidebar-profile-icon" />
        <div className="sidebar-profile-name">
          {user ? user.namaPengguna : "Username"}
        </div>
        <div className="sidebar-profile-role">Karyawan</div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li> 
              <NavLink to="/" className="sidebar-nav-item">
                <HiChartPie size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/upload-dokumen" className="sidebar-nav-item">
              <HiUpload size={20} />
              <span>Upload Dokumen</span>
            </NavLink>
          </li>
          <li>
            <a href="#" className="sidebar-nav-item">
              <HiCollection size={20} />
              <span>Riwayat Dokumen</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
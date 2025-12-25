// frontend/src/components/AdminSidebar.jsx
// Sidebar khusus untuk halaman Administrator

import { 
  HiChartPie, 
  HiUserAdd, 
  HiDocumentText,
  HiUserCircle,
} from 'react-icons/hi';
import "./sidebar.css"
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { user } = useAuth();
  return (
    <div className="sidebar"> 
      <div className="sidebar-profile">
        <HiUserCircle size={70} className="sidebar-profile-icon" />
        <div className="sidebar-profile-name">
          {user ? user.namaPengguna : "Admin"}
        </div>
        <div className="sidebar-profile-role">Administrator</div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li> 
            <NavLink to="/admin" end className="sidebar-nav-item">
              <HiChartPie size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/kelola-dokumen" className="sidebar-nav-item">
              <HiDocumentText size={20} />
              <span>Kelola Dokumen</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/kelola-karyawan" className="sidebar-nav-item">
              <HiUserAdd size={20} />
              <span>Kelola Karyawan</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;

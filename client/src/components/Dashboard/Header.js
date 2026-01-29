import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1 className="header-title">Task Manager</h1>
        <div className="header-right">
          <div className="user-info">
            <span className="user-label">Usuario:</span>
            <span className="user-name">{user?.username || 'Usuario'}</span>
            {user?.role === 'admin' && <span className="user-badge">Admin</span>}
          </div>
          <button onClick={handleLogout} className="logout-button">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

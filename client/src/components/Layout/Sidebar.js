import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import {
    MdDashboard,
    MdCheckCircle,
    MdFolder,
    MdAssessment,
    MdNotifications
} from 'react-icons/md';

const Sidebar = ({ activeTab, onTabChange }) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
            logout();
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: <MdDashboard /> },
        { id: 'tareas', label: 'Tasks', icon: <MdCheckCircle /> },
        { id: 'proyectos', label: 'Projects', icon: <MdFolder /> },
        { id: 'reportes', label: 'Reports', icon: <MdAssessment /> },
        { id: 'notificaciones', label: 'Notifications', icon: <MdNotifications /> },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar__container">
                <div className="sidebar__logo">
                    <div className="logo-icon">TM</div>
                    Task Manager
                </div>

                <nav className="sidebar__nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`sidebar__item ${activeTab === item.id ? 'sidebar__item--active' : ''}`}
                                    onClick={() => onTabChange(item.id)}
                                >
                                    <span className="sidebar__icon">{item.icon}</span>
                                    <span className="sidebar__label">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar__footer">
                    <button onClick={handleLogout} className="sidebar__item logout-btn">
                        <span className="sidebar__icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path></svg>
                        </span>
                        <span className="sidebar__label">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

import React from 'react';
import './Sidebar.css';
import {
    MdDashboard,
    MdCheckCircle,
    MdFolder,
    MdAssessment,
    MdNotifications
} from 'react-icons/md';

const Sidebar = ({ activeTab, onTabChange }) => {
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
                    <div className="user-avatar">
                        <span>US</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

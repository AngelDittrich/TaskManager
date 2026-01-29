import React from 'react';
import { FaTasks, FaProjectDiagram, FaComments, FaHistory, FaBell, FaSearch, FaChartBar } from 'react-icons/fa';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'tareas', label: 'Tareas', icon: FaTasks },
    { id: 'proyectos', label: 'Proyectos', icon: FaProjectDiagram },
    { id: 'comentarios', label: 'Comentarios', icon: FaComments },
    { id: 'historial', label: 'Historial', icon: FaHistory },
    { id: 'notificaciones', label: 'Notificaciones', icon: FaBell },
    { id: 'busqueda', label: 'Búsqueda', icon: FaSearch },
    { id: 'reportes', label: 'Reportes', icon: FaChartBar }
  ];

  return (
    <nav className="dashboard-nav">
      <div className="nav-container">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

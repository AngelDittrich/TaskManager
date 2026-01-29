import React from 'react';
import { FaEdit, FaTrash, FaUsers, FaCalendar } from 'react-icons/fa';
import { format } from 'date-fns';
import './ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const statusColors = {
    'activo': '#2ed573',
    'pausado': '#ffa502',
    'completado': '#3742fa',
    'cancelado': '#ff4757'
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <div className="project-actions">
          <button onClick={() => onEdit(project)} className="icon-btn">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(project._id)} className="icon-btn delete">
            <FaTrash />
          </button>
        </div>
      </div>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      <div className="project-meta">
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[project.status] || '#ccc' }}
        >
          {project.status}
        </span>

        {project.members && project.members.length > 0 && (
          <div className="project-info">
            <FaUsers />
            <span>{project.members.length} miembro(s)</span>
          </div>
        )}

        {project.startDate && (
          <div className="project-info">
            <FaCalendar />
            <span>Inicio: {format(new Date(project.startDate), 'dd/MM/yyyy')}</span>
          </div>
        )}

        {project.endDate && (
          <div className="project-info">
            <FaCalendar />
            <span>Fin: {format(new Date(project.endDate), 'dd/MM/yyyy')}</span>
          </div>
        )}

        <div className="project-info">
          <span>Creado por: {project.createdBy?.username || 'Usuario'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

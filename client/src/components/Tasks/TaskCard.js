import React from 'react';
import { FaEdit, FaTrash, FaCalendar, FaUser, FaProjectDiagram } from 'react-icons/fa';
import { format } from 'date-fns';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    'pendiente': '#ffa502',
    'en-progreso': '#3742fa',
    'completada': '#2ed573',
    'cancelada': '#ff4757'
  };

  const priorityColors = {
    'baja': '#95a5a6',
    'media': '#f39c12',
    'alta': '#e74c3c'
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="icon-btn">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(task._id)} className="icon-btn delete">
            <FaTrash />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span
            className="status-badge"
            style={{ backgroundColor: statusColors[task.status] || '#ccc' }}
          >
            {task.status}
          </span>
          <span
            className="priority-badge"
            style={{ backgroundColor: priorityColors[task.priority] || '#ccc' }}
          >
            {task.priority}
          </span>
        </div>

        {task.project && (
          <div className="task-info">
            <FaProjectDiagram />
            <span>{task.project?.name || 'Proyecto'}</span>
          </div>
        )}

        {task.assignedTo && (
          <div className="task-info">
            <FaUser />
            <span>{task.assignedTo?.username || 'Sin asignar'}</span>
          </div>
        )}

        {task.dueDate && (
          <div className="task-info">
            <FaCalendar />
            <span>{format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

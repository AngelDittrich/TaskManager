import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaEdit, FaTrash, FaCalendar, FaUser, FaProjectDiagram } from 'react-icons/fa';
import { format } from 'date-fns';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, isOverlay }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: task,
  });

  const style = transform
    ? {
      transform: CSS.Translate.toString(transform),
    }
    : undefined;

  const statusColors = {
    'pendiente': '#ffa502',
    'en-progreso': '#3742fa',
    'completada': '#2ed573',
    'cancelada': '#ff4757',
  };

  const priorityColors = {
    'baja': '#95a5a6',
    'media': '#f39c12',
    'alta': '#e74c3c',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'is-dragging' : ''} ${isOverlay ? 'is-overlay' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="task-header">
        <h3 className="task-title" title={task.title}>
          {task.title}
        </h3>
        <div className="task-actions" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(task)} className="icon-btn">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(task._id)} className="icon-btn delete">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="task-body">
        {task.description ? (
          <p className="task-description">{task.description}</p>
        ) : (
          <p className="task-description empty">No description</p>
        )}
      </div>

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

        <div className="task-info-group">
          {task.project && (
            <div className="task-info">
              <FaProjectDiagram />
              <span className="truncate">{task.project?.name || 'Proyecto'}</span>
            </div>
          )}

          {task.assignedTo && (
            <div className="task-info">
              <FaUser />
              <span className="truncate">{task.assignedTo?.username || 'Sin asignar'}</span>
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
    </div>
  );
};

export default TaskCard;

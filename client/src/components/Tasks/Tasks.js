import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../../services/api';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import Card from '../UI/Card';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    project: '',
    dueStatus: '' // 'all', 'onTime', 'overdue'
  });

  useEffect(() => {
    loadTasks();
  }, [filters.status, filters.project]); // Only reload from API when these change

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks({ status: filters.status, project: filters.project });
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSave = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowModal(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error al guardar la tarea');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  // Client-side filtering by due date
  const getFilteredTasks = () => {
    if (!filters.dueStatus || filters.dueStatus === 'all') {
      return tasks;
    }

    const now = new Date();
    return tasks.filter(task => {
      if (!task.dueDate) return filters.dueStatus === 'onTime'; // Tasks without due date are "on time"

      const dueDate = new Date(task.dueDate);
      const isOverdue = dueDate < now && task.status !== 'completada';

      if (filters.dueStatus === 'overdue') {
        return isOverdue;
      } else if (filters.dueStatus === 'onTime') {
        return !isOverdue;
      }
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="bento-grid tasks-layout animate-fade-in">
      {/* Header Card */}
      <div className="grid-item span-4-col tasks-header-container">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <button onClick={handleCreate} className="primary">
            + New Task
          </button>
        </div>

        {/* Filters Card */}
        <div className="grid-item span-4-col tasks-header-filters">
          <div className="tasks-filters">
            <div className="filter-group">
              <label>Estado:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="filter-select"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en-progreso">En Progreso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Fecha de entrega:</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filters.dueStatus === '' || filters.dueStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, dueStatus: 'all' })}
                >
                  Todas
                </button>
                <button
                  className={`filter-btn ${filters.dueStatus === 'onTime' ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, dueStatus: 'onTime' })}
                >
                  En fecha
                </button>
                <button
                  className={`filter-btn overdue ${filters.dueStatus === 'overdue' ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, dueStatus: 'overdue' })}
                >
                  Vencidas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid-item span-4-col" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando tareas...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card variant="primary" className="grid-item span-4-col">
          <div className="empty-state">No hay tareas disponibles</div>
        </Card>
      ) : (
        filteredTasks.map(task => (
          <div key={task._id} className="grid-item">
            <TaskCard
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Tasks;

import React, { useState, useEffect } from 'react';
import { getHistory } from '../../services/api';
import { format } from 'date-fns';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ entityType: '', entityId: '' });

  useEffect(() => {
    loadHistory();
  }, [filters]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.entityType) params.entityType = filters.entityType;
      if (filters.entityId) params.entityId = filters.entityId;
      
      const response = await getHistory(params);
      setHistory(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-container">
      <h2>Historial</h2>

      <div className="history-filters">
        <select
          value={filters.entityType}
          onChange={(e) => setFilters({ ...filters, entityType: e.target.value, entityId: '' })}
          className="filter-select"
        >
          <option value="">Todos los tipos</option>
          <option value="task">Tareas</option>
          <option value="project">Proyectos</option>
          <option value="comment">Comentarios</option>
          <option value="user">Usuarios</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando historial...</div>
      ) : history.length === 0 ? (
        <div className="empty-state">No hay registros en el historial</div>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div key={item._id} className="history-item">
              <div className="history-header">
                <div>
                  <strong>{item.action}</strong>
                  <span className="history-type">{item.entityType}</span>
                </div>
                <span className="history-date">
                  {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <div className="history-details">
                <span>Por: {item.performedBy?.username || 'Usuario'}</span>
                {item.changes && (
                  <div className="history-changes">
                    Cambios: {JSON.stringify(item.changes, null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

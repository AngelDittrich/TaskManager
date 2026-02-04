import React, { useState } from 'react';
import { getTaskReport, getProjectReport, getUserReport, exportToCSV } from '../../services/api';
import { FaDownload, FaFileCsv } from 'react-icons/fa';
import Card from '../UI/Card';
import './Reports.css';

const Reports = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleGenerateReport = async (type) => {
    try {
      setLoading(true);
      setActiveReport(type);
      setReportData(null); // Clear previous data
      let response;

      if (type === 'tasks') {
        response = await getTaskReport(filters);
      } else if (type === 'projects') {
        response = await getProjectReport(filters);
      } else if (type === 'users') {
        response = await getUserReport();
      }

      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (type) => {
    try {
      const response = await exportToCSV(type);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${type}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar el CSV');
    }
  };

  return (
    <div className="bento-grid reports-layout animate-fade-in">
      {/* 1. Header & Controls */}
      <Card variant="primary" className="grid-item span-4-col">
        <div className="reports-header">
          <h2>Generación de Reportes</h2>
          <div className="reports-buttons">
            <button
              onClick={() => handleGenerateReport('tasks')}
              className={`report-button ${activeReport === 'tasks' ? 'active' : ''}`}
              disabled={loading}
            >
              Reporte de Tareas
            </button>
            <button
              onClick={() => handleGenerateReport('projects')}
              className={`report-button ${activeReport === 'projects' ? 'active' : ''}`}
              disabled={loading}
            >
              Reporte de Proyectos
            </button>
            <button
              onClick={() => handleGenerateReport('users')}
              className={`report-button ${activeReport === 'users' ? 'active' : ''}`}
              disabled={loading}
            >
              Reporte de Usuarios
            </button>
            <button
              onClick={() => handleExportCSV('tasks')}
              className="report-button export"
              disabled={loading}
            >
              <FaFileCsv /> Exportar a CSV
            </button>
          </div>
        </div>
      </Card>

      {/* 2. Filters (Conditional) */}
      {(activeReport === 'tasks' || activeReport === 'projects') && (
        <Card variant="primary" className="grid-item span-4-col">
          <div className="report-filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">Todos los estados</option>
              {activeReport === 'tasks' ? (
                <>
                  <option value="pendiente">Pendiente</option>
                  <option value="en-progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </>
              ) : (
                <>
                  <option value="activo">Activo</option>
                  <option value="pausado">Pausado</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </>
              )}
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="filter-input"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="filter-input"
            />
          </div>
        </Card>
      )}

      {/* 3. Loading State */}
      {loading && (
        <div className="grid-item span-4-col" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Generando reporte...</p>
        </div>
      )}

      {/* 4. Statistics Cards */}
      {reportData && reportData.stats && Object.entries(reportData.stats).map(([key, value]) => (
        <Card key={key} variant="metric" className="grid-item">
          <h3 style={{ textTransform: 'capitalize' }}>{key}</h3>
          <div className="metric-value">{value}</div>
        </Card>
      ))}

      {/* 5. Data Table */}
      {reportData && (
        <Card variant="primary" className="grid-item span-4-col">
          <div className="report-data">
            {activeReport === 'tasks' && reportData.tasks && (
              <div>
                <h3>Tareas ({reportData.tasks.length})</h3>
                <div className="data-table-container">
                  <table className="report-data-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Proyecto</th>
                        <th>Asignado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.tasks.map(task => (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>
                            <span className={`task-badge ${task.priority}`}>{task.status}</span>
                          </td>
                          <td>
                            <span className={`task-priority-badge ${task.priority}`}></span>
                            {task.priority}
                          </td>
                          <td>{task.project?.name || '-'}</td>
                          <td>{task.assignedTo?.username || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeReport === 'projects' && reportData.projects && (
              <div>
                <h3>Proyectos ({reportData.projects.length})</h3>
                <div className="data-table-container">
                  <table className="report-data-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Creado Por</th>
                        <th>Miembros</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.projects.map(project => (
                        <tr key={project._id}>
                          <td>{project.name}</td>
                          <td>{project.status}</td>
                          <td>{project.createdBy?.username}</td>
                          <td>{project.members?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeReport === 'users' && reportData.users && (
              <div>
                <h3>Usuarios ({reportData.users.length})</h3>
                <div className="data-table-container">
                  <table className="report-data-table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Tareas Asignadas</th>
                        <th>Tareas Creadas</th>
                        <th>Proyectos Creados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.users.map(user => (
                        <tr key={user._id || user.id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.tasksAssigned || 0}</td>
                          <td>{user.tasksCreated || 0}</td>
                          <td>{user.projectsCreated || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;

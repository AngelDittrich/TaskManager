import React, { useState } from 'react';
import { getTaskReport, getProjectReport, getUserReport, exportToCSV } from '../../services/api';
import { FaDownload, FaFileCsv } from 'react-icons/fa';
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
    <div className="reports-container">
      <h2>Generación de Reportes</h2>

      <div className="reports-buttons">
        <button
          onClick={() => handleGenerateReport('tasks')}
          className="report-button"
          disabled={loading}
        >
          Reporte de Tareas
        </button>
        <button
          onClick={() => handleGenerateReport('projects')}
          className="report-button"
          disabled={loading}
        >
          Reporte de Proyectos
        </button>
        <button
          onClick={() => handleGenerateReport('users')}
          className="report-button"
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

      {(activeReport === 'tasks' || activeReport === 'projects') && (
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
            placeholder="Fecha inicio"
            className="filter-input"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            placeholder="Fecha fin"
            className="filter-input"
          />
        </div>
      )}

      {loading && <div className="loading">Generando reporte...</div>}

      {reportData && (
        <div className="report-content">
          <div className="report-stats">
            {reportData.stats && (
              <div className="stats-grid">
                {Object.entries(reportData.stats).map(([key, value]) => (
                  <div key={key} className="stat-card">
                    <div className="stat-label">{key}</div>
                    <div className="stat-value">{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="report-data">
            {activeReport === 'tasks' && reportData.tasks && (
              <div>
                <h3>Tareas ({reportData.tasks.length})</h3>
                <div className="data-table">
                  <table>
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
                          <td>{task.status}</td>
                          <td>{task.priority}</td>
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
                <div className="data-table">
                  <table>
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
                <div className="data-table">
                  <table>
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
        </div>
      )}
    </div>
  );
};

export default Reports;

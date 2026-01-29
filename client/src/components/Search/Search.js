import React, { useState } from 'react';
import { search } from '../../services/api';
import { FaSearch } from 'react-icons/fa';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await search(query, type);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Búsqueda</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar tareas, proyectos, comentarios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="search-type-select"
        >
          <option value="">Todo</option>
          <option value="tasks">Tareas</option>
          <option value="projects">Proyectos</option>
          <option value="comments">Comentarios</option>
        </select>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {results && (
        <div className="search-results">
          {results.tasks && results.tasks.length > 0 && (
            <div className="results-section">
              <h3>Tareas ({results.tasks.length})</h3>
              <div className="results-list">
                {results.tasks.map(task => (
                  <div key={task._id} className="result-item">
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                    <span className="result-meta">Estado: {task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.projects && results.projects.length > 0 && (
            <div className="results-section">
              <h3>Proyectos ({results.projects.length})</h3>
              <div className="results-list">
                {results.projects.map(project => (
                  <div key={project._id} className="result-item">
                    <h4>{project.name}</h4>
                    {project.description && <p>{project.description}</p>}
                    <span className="result-meta">Estado: {project.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.comments && results.comments.length > 0 && (
            <div className="results-section">
              <h3>Comentarios ({results.comments.length})</h3>
              <div className="results-list">
                {results.comments.map(comment => (
                  <div key={comment._id} className="result-item">
                    <p>{comment.content}</p>
                    <span className="result-meta">
                      Por: {comment.createdBy?.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results && (!results.tasks || results.tasks.length === 0) &&
            (!results.projects || results.projects.length === 0) &&
            (!results.comments || results.comments.length === 0) && (
              <div className="empty-state">No se encontraron resultados</div>
            )}
        </div>
      )}
    </div>
  );
};

export default Search;

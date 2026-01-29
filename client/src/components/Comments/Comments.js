import React, { useState, useEffect } from 'react';
import { getComments, createComment, deleteComment } from '../../services/api';
import { getTasks } from '../../services/api';
import { getProjects } from '../../services/api';
import { format } from 'date-fns';
import './Comments.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', id: '' });
  const [newComment, setNewComment] = useState({ content: '', task: '', project: '' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadComments();
  }, [filter]);

  const loadData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        getTasks(),
        getProjects()
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      loadComments();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const params = {};
      if (filter.type === 'task' && filter.id) params.task = filter.id;
      if (filter.type === 'project' && filter.id) params.project = filter.id;
      
      const response = await getComments(params);
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.content) return;

    try {
      const data = {
        content: newComment.content,
        ...(newComment.task ? { task: newComment.task } : {}),
        ...(newComment.project ? { project: newComment.project } : {})
      };
      await createComment(data);
      setNewComment({ content: '', task: '', project: '' });
      loadComments();
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Error al crear el comentario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      try {
        await deleteComment(id);
        loadComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error al eliminar el comentario');
      }
    }
  };

  return (
    <div className="comments-container">
      <h2>Comentarios</h2>

      <div className="comments-filters">
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value, id: '' })}
          className="filter-select"
        >
          <option value="">Todos los comentarios</option>
          <option value="task">Filtrar por tarea</option>
          <option value="project">Filtrar por proyecto</option>
        </select>
        {filter.type === 'task' && (
          <select
            value={filter.id}
            onChange={(e) => setFilter({ ...filter, id: e.target.value })}
            className="filter-select"
          >
            <option value="">Seleccionar tarea</option>
            {tasks.map(task => (
              <option key={task._id} value={task._id}>{task.title}</option>
            ))}
          </select>
        )}
        {filter.type === 'project' && (
          <select
            value={filter.id}
            onChange={(e) => setFilter({ ...filter, id: e.target.value })}
            className="filter-select"
          >
            <option value="">Seleccionar proyecto</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Escribe un comentario..."
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          rows="3"
          required
        />
        <div className="comment-form-actions">
          <select
            value={newComment.task}
            onChange={(e) => setNewComment({ ...newComment, task: e.target.value, project: '' })}
            className="filter-select"
          >
            <option value="">Asociar a tarea (opcional)</option>
            {tasks.map(task => (
              <option key={task._id} value={task._id}>{task.title}</option>
            ))}
          </select>
          <select
            value={newComment.project}
            onChange={(e) => setNewComment({ ...newComment, project: e.target.value, task: '' })}
            className="filter-select"
          >
            <option value="">Asociar a proyecto (opcional)</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Comentar</button>
        </div>
      </form>

      {loading ? (
        <div className="loading">Cargando comentarios...</div>
      ) : comments.length === 0 ? (
        <div className="empty-state">No hay comentarios disponibles</div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment-card">
              <div className="comment-header">
                <div>
                  <strong>{comment.createdBy?.username || 'Usuario'}</strong>
                  <span className="comment-date">
                    {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="icon-btn delete"
                >
                  ×
                </button>
              </div>
              <p className="comment-content">{comment.content}</p>
              {(comment.task || comment.project) && (
                <div className="comment-association">
                  {comment.task && <span>Tarea: {comment.task?.title}</span>}
                  {comment.project && <span>Proyecto: {comment.project?.name}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;

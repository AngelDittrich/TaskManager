import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tasks
export const getTasks = (params) => axios.get(`${API_URL}/tasks`, { params });
export const getTask = (id) => axios.get(`${API_URL}/tasks/${id}`);
export const createTask = (data) => axios.post(`${API_URL}/tasks`, data);
export const updateTask = (id, data) => axios.put(`${API_URL}/tasks/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API_URL}/tasks/${id}`);

// Projects
export const getProjects = () => axios.get(`${API_URL}/projects`);
export const getProject = (id) => axios.get(`${API_URL}/projects/${id}`);
export const createProject = (data) => axios.post(`${API_URL}/projects`, data);
export const updateProject = (id, data) => axios.put(`${API_URL}/projects/${id}`, data);
export const deleteProject = (id) => axios.delete(`${API_URL}/projects/${id}`);

// Comments
export const getComments = (params) => axios.get(`${API_URL}/comments`, { params });
export const createComment = (data) => axios.post(`${API_URL}/comments`, data);
export const deleteComment = (id) => axios.delete(`${API_URL}/comments/${id}`);

// History
export const getHistory = (params) => axios.get(`${API_URL}/history`, { params });

// Notifications
export const getNotifications = () => axios.get(`${API_URL}/notifications`);
export const markNotificationRead = (id) => axios.put(`${API_URL}/notifications/${id}/read`);
export const markAllNotificationsRead = () => axios.put(`${API_URL}/notifications/read-all`);
export const deleteNotification = (id) => axios.delete(`${API_URL}/notifications/${id}`);

// Search
export const search = (query, type) => axios.get(`${API_URL}/search`, { params: { q: query, type } });

// Reports
export const getTaskReport = (params) => axios.get(`${API_URL}/reports/tasks`, { params });
export const getProjectReport = (params) => axios.get(`${API_URL}/reports/projects`, { params });
export const getUserReport = () => axios.get(`${API_URL}/reports/users`);
export const exportToCSV = (type) => {
  return axios.get(`${API_URL}/reports/export/${type}`, {
    responseType: 'blob'
  });
};

// Users
export const getUsers = () => axios.get(`${API_URL}/users`);

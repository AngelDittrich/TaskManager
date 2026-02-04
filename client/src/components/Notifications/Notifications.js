import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../services/api';
import { format } from 'date-fns';
import { FaCheck, FaTrash, FaCheckDouble } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log('Notifications loaded:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notificaciones</h2>
        {unreadCount > 0 && (
          <div className="notifications-actions">
            <button onClick={handleMarkAllRead} className="btn-secondary">
              <FaCheckDouble /> Marcar todas como leídas
            </button>
            <span className="unread-badge">{unreadCount} sin leer</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Cargando notificaciones...</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">No hay notificaciones</div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-date">
                  {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    className="icon-btn"
                    title="Marcar como leída"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="icon-btn delete"
                  title="Eliminar"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

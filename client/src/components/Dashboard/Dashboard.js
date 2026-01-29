import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import Card from '../UI/Card';
import './Dashboard.css';
import {
  getTasks,
  getProjects,
  getHistory,
  getTaskReport,
  getNotifications,
  markAllNotificationsRead
} from '../../services/api';

// Import existing sub-components to keep functionality accessible
import Tasks from '../Tasks/Tasks';
import Projects from '../Projects/Projects';
import Comments from '../Comments/Comments';
import History from '../History/History';
import Notifications from '../Notifications/Notifications';
import Search from '../Search/Search';
import Reports from '../Reports/Reports';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  // Dashboard Data State
  const [stats, setStats] = useState({
    pendingTasks: 0,
    activeProjects: 0,
    completionRate: 0,
    tasksDueSoon: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reportStats, setReportStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch exhaustive data for intelligent insights
        const [taskReportRes, projectsRes, historyRes, notificationsRes] = await Promise.all([
          getTaskReport(), // Returns { tasks, stats }
          getProjects(),
          getHistory({ limit: 20 }),
          getNotifications()
        ]);

        const allTasks = taskReportRes.data.tasks;
        const taskStats = taskReportRes.data.stats;

        // --- Smart Insights Logic ---
        const now = new Date();
        const pending = allTasks.filter(t => t.status === 'pendiente' || t.status === 'en-progreso');

        // Overdue: Due date is in the past AND not completed
        const overdue = pending.filter(t => t.dueDate && new Date(t.dueDate) < now);

        // High Priority: Priority is 'alta' AND pending
        const highPriority = pending.filter(t => t.priority === 'alta');

        // Due Soon: Due date is within next 48 hours
        const dueSoon = pending
          .filter(t => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate);
            const diffHours = (due - now) / (1000 * 60 * 60);
            return diffHours > 0 && diffHours <= 48;
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 3);

        const totalTasks = allTasks.length;
        const completedCount = taskStats.completada || 0;
        const rate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

        setStats({
          pendingTasks: taskStats.pendiente + (taskStats['en-progreso'] || 0),
          activeProjects: projectsRes.data.stats ? projectsRes.data.stats.activo : projectsRes.data.length,
          completionRate: rate,
          tasksDueSoon: dueSoon,
          overdueTasks: overdue,
          highPriorityTasks: highPriority
        });

        setReportStats(taskStats);
        setRecentActivity(historyRes.data);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bento-grid animate-fade-in">
            {/* 1. Intelligent Welcome Card */}
            <Card variant="glass" className="grid-item span-2-col welcome-card">
              <div className="welcome-content">
                <span className="greeting-badge">{getGreeting()}</span>
                <h1>Welcome, {user ? user.username : 'User'}</h1>
                <p>
                  You have {stats.pendingTasks} pending tasks.
                  {stats.overdueTasks && stats.overdueTasks.length > 0 && <span style={{ color: '#ff4757', fontWeight: 'bold' }}> {stats.overdueTasks.length} are overdue.</span>}
                </p>
              </div>
            </Card>

            {/* 2. Visual Report Card (New) */}
            <Card variant="primary" className="grid-item progress-card">
              <h3>Task Trends</h3>
              {reportStats ? (
                <div className="chart-container">
                  <div className="chart-bar-group">
                    <div className="chart-bar" style={{ height: `${(reportStats.completada / (reportStats.total || 1)) * 100}%` }}></div>
                    <span className="chart-label">Done</span>
                  </div>
                  <div className="chart-bar-group">
                    <div className="chart-bar" style={{ height: `${(reportStats.pendiente / (reportStats.total || 1)) * 100}%`, background: '#ffa502' }}></div>
                    <span className="chart-label">Todo</span>
                  </div>
                  <div className="chart-bar-group">
                    <div className="chart-bar" style={{ height: `${((reportStats['en-progreso'] || 0) / (reportStats.total || 1)) * 100}%`, background: '#3742fa' }}></div>
                    <span className="chart-label">Prog</span>
                  </div>
                </div>
              ) : <p>Loading stats...</p>}
            </Card>

            {/* 3. Metrics Overview */}
            <Card variant="metric" className="grid-item metric-card">
              <h3>Active Projects</h3>
              <div className="metric-value">
                {loading ? '...' : stats.activeProjects}
              </div>
              <span className="metric-trend">Overview</span>
            </Card>

            {/* 4. Enhanced Activity Timeline */}
            <Card variant="primary" className="grid-item span-2-row activity-card">
              <div className="card-header">
                <h3>Timeline</h3>
                <button className="text-link" onClick={() => setActiveTab('historial')}>View Full History</button>
              </div>
              <ul className="activity-list">
                {loading ? (
                  <li className="loading-item">Loading...</li>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <li key={activity._id || idx} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-info">
                        <p>{activity.action}</p>
                        <span className="activity-time">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="empty-state">No recent activity</li>
                )}
              </ul>
            </Card>

            {/* 5. Smart Insights: Focus Items (Overdue & Due Soon) */}
            <Card variant="glass" className="grid-item span-2-col tasks-due-card">
              <div className="card-header">
                <h3>Focus Items</h3>
                {stats.overdueTasks && stats.overdueTasks.length > 0 && <span className="task-badge alta">{stats.overdueTasks.length} Overdue</span>}
              </div>

              <div className="task-mini-list">
                {/* 1. Show Overdue First */}
                {stats.overdueTasks && stats.overdueTasks.slice(0, 2).map(task => (
                  <div key={task._id} className="task-mini-item" style={{ borderLeft: '3px solid #ff4757' }}>
                    <span className="task-priority-badge overdue"></span>
                    <p>{task.title}</p>
                    <span className="task-badge-time">Overdue</span>
                  </div>
                ))}

                {/* 2. Show Due Soon / High Priority */}
                {stats.tasksDueSoon && stats.tasksDueSoon.filter(t => !stats.overdueTasks?.find(o => o._id === t._id)).slice(0, 3).map(task => (
                  <div key={task._id} className="task-mini-item">
                    <span className={`task-priority-badge ${task.priority}`}></span>
                    <p>{task.title}</p>
                    <span className={`task-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                ))}

                {(!stats.overdueTasks || stats.overdueTasks.length === 0) && (!stats.tasksDueSoon || stats.tasksDueSoon.length === 0) && (
                  <p className="empty-state">No urgent tasks. Clear skies ahead!</p>
                )}
              </div>
            </Card>

            {/* 6. Notifications Center (New) */}
            <Card variant="primary" className="grid-item span-2-col">
              <div className="card-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button className="text-link" onClick={markAllNotificationsRead}>Mark read</button>
                )}
              </div>
              {notifications.length > 0 ? (
                <div className="notification-list">
                  {notifications.slice(0, 3).map(notif => (
                    <div key={notif._id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                      <div className="notification-header">
                        <span>{notif.type}</span>
                        <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{notif.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No new notifications</p>
              )}
            </Card>
          </div>
        );
      case 'tareas':
        return <Tasks />;
      case 'proyectos':
        return <Projects />;
      case 'comentarios':
        return <Comments />;
      case 'historial':
        return <History />;
      case 'notificaciones':
        return <Notifications />;
      case 'busqueda':
        return <Search />;
      case 'reportes':
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Dashboard;

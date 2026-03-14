import React, { useState, useEffect } from 'react';
import { getTasks, getProjects, getUsers } from '../../services/api';
import './Workload.css';
import { MdAccessTime, MdWorkOutline, MdWarning } from 'react-icons/md';

const Workload = () => {
    const [loading, setLoading] = useState(true);
    const [workloadData, setWorkloadData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndCalculateWorkload = async () => {
            try {
                setLoading(true);
                // Fetch required data
                const [tasksRes, usersRes, projectsRes] = await Promise.all([
                    getTasks(),
                    getUsers(),
                    getProjects() // Just in case, to see all projects
                ]);

                const tasks = tasksRes.data;
                const users = usersRes.data;

                // 1. Group tasks by assigned user
                const userWorkload = users.map(user => {
                    const userTasks = tasks.filter(t => 
                        (t.assignedTo && t.assignedTo._id === user._id) || 
                        (t.assignedTo === user._id)
                    ).filter(t => t.status === 'pendiente' || t.status === 'en-progreso');

                    // 2. Calculate estimated task time (Tiempo estimado)
                    // Assumption: Baja=2h, Media=4h, Alta=8h
                    let estimatedTimeHours = 0;
                    const projectSet = new Set();
                    
                    userTasks.forEach(t => {
                        if (t.priority === 'alta') estimatedTimeHours += 8;
                        else if (t.priority === 'media') estimatedTimeHours += 4;
                        else estimatedTimeHours += 2;

                        if (t.project) {
                            projectSet.add(typeof t.project === 'object' ? t.project._id : t.project);
                        }
                    });

                    // 3. Saturación de proyectos (Project saturation)
                    const activeProjectsCount = projectSet.size;

                    // 4. Calculate overall workload percentage
                    // Let's assume a realistic weekly capacity is 40 hours.
                    const maxCapacityHours = 40;
                    let workloadPercentage = Math.round((estimatedTimeHours / maxCapacityHours) * 100);
                    
                    // Cap at 100 for gauge visualization, but keep original for display if needed
                    const cappedPercentage = workloadPercentage > 100 ? 100 : workloadPercentage;
                    
                    // Determine workload level
                    let level = 'Bajo';
                    let levelClass = 'bajo';
                    if (workloadPercentage >= 50 && workloadPercentage < 75) {
                        level = 'Medio';
                        levelClass = 'medio';
                    } else if (workloadPercentage >= 75) {
                        level = 'Alto';
                        levelClass = 'alto';
                    }

                    return {
                        id: user._id,
                        name: user.username || user.name || 'Unknown User',
                        tasksCount: userTasks.length,
                        estimatedTime: estimatedTimeHours,
                        projectsCount: activeProjectsCount,
                        percentage: cappedPercentage,
                        realPercentage: workloadPercentage,
                        level,
                        levelClass
                    };
                });

                // Sort by highest workload first
                userWorkload.sort((a, b) => b.realPercentage - a.realPercentage);
                
                setWorkloadData(userWorkload);
            } catch (err) {
                console.error("Error fetching workload data:", err);
                setError("No se pudo cargar la información de cargas de trabajo.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndCalculateWorkload();
    }, []);

    const renderGauge = (percentage, levelClass) => {
        // Radius of the circle
        const radius = 80;
        // Circumference
        const circumference = Math.PI * radius;
        // Stroke offset based on percentage
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="gauge-container">
                <svg viewBox="0 0 200 100" className="gauge-svg">
                    <defs>
                        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4cd137" />
                            <stop offset="50%" stopColor="#fbc531" />
                            <stop offset="100%" stopColor="#e84118" />
                        </linearGradient>
                    </defs>
                    {/* Background Arc */}
                    <path 
                        className="gauge-background-path"
                        d="M 20 100 A 80 80 0 0 1 180 100" 
                    />
                    {/* Progress Arc */}
                    <path 
                        className="gauge-progress-path"
                        d="M 20 100 A 80 80 0 0 1 180 100" 
                        stroke="url(#arcGradient)"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div className="gauge-center">
                    <div className="gauge-percentage">{percentage}%</div>
                    <div className={`gauge-level level-${levelClass}`}>{levelClass.toUpperCase()}</div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Cargando métricas de trabajo...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="workload-container">
            <div className="workload-header">
                <h2>Carga de Trabajo por Usuario</h2>
            </div>
            
            {workloadData.length === 0 ? (
                <div className="empty-state">No hay usuarios disponibles en el sistema.</div>
            ) : (
                <div className="workload-grid">
                    {workloadData.map(data => (
                        <div key={data.id} className="workload-card">
                            <div className="workload-user">{data.name}</div>
                            
                            {renderGauge(data.percentage, data.levelClass)}
                            
                            <div className="workload-metrics">
                                <div className="metric-row">
                                    <span className="metric-label">
                                        <MdAccessTime size={16} /> Tiempo estimado
                                    </span>
                                    <span className="metric-value">{data.estimatedTime}h</span>
                                </div>
                                <div className="metric-row">
                                    <span className="metric-label">
                                        <MdWorkOutline size={16} /> Saturación (Proyectos)
                                    </span>
                                    <span className="metric-value">{data.projectsCount} activos</span>
                                </div>
                                <div className="metric-row">
                                    <span className="metric-label">
                                        <MdWarning size={16} /> Tareas asignadas
                                    </span>
                                    <span className="metric-value">{data.tasksCount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Workload;

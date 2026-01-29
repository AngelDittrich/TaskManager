const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const router = express.Router();

// Task Report
router.get('/tasks', auth, async (req, res) => {
  try {
    const { status, project, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (project) filter.project = project;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    const stats = {
      total: tasks.length,
      pendiente: tasks.filter(t => t.status === 'pendiente').length,
      'en-progreso': tasks.filter(t => t.status === 'en-progreso').length,
      completada: tasks.filter(t => t.status === 'completada').length,
      cancelada: tasks.filter(t => t.status === 'cancelada').length
    };

    res.json({ tasks, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Project Report
router.get('/projects', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'username')
      .populate('members', 'username')
      .sort({ createdAt: -1 });

    const stats = {
      total: projects.length,
      activo: projects.filter(p => p.status === 'activo').length,
      pausado: projects.filter(p => p.status === 'pausado').length,
      completado: projects.filter(p => p.status === 'completado').length,
      cancelado: projects.filter(p => p.status === 'cancelado').length
    };

    res.json({ projects, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Report
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const userStats = await Promise.all(
      users.map(async (user) => {
        const tasksAssigned = await Task.countDocuments({ assignedTo: user._id });
        const tasksCreated = await Task.countDocuments({ createdBy: user._id });
        const projectsCreated = await Project.countDocuments({ createdBy: user._id });
        const projectsMember = await Project.countDocuments({ members: user._id });

        return {
          ...user.toObject(),
          tasksAssigned,
          tasksCreated,
          projectsCreated,
          projectsMember
        };
      })
    );

    const stats = {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length
    };

    res.json({ users: userStats, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export to CSV
router.get('/export/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const { format } = req.query;

    let data = [];
    let filename = '';
    let headers = [];

    if (type === 'tasks') {
      const tasks = await Task.find()
        .populate('project', 'name')
        .populate('assignedTo', 'username')
        .populate('createdBy', 'username');

      data = tasks.map(task => ({
        id: task._id,
        titulo: task.title,
        descripcion: task.description,
        estado: task.status,
        prioridad: task.priority,
        proyecto: task.project?.name || 'Sin proyecto',
        asignadoA: task.assignedTo?.username || 'Sin asignar',
        creadoPor: task.createdBy?.username,
        fechaVencimiento: task.dueDate || '',
        fechaCreacion: task.createdAt
      }));

      headers = [
        { id: 'id', title: 'ID' },
        { id: 'titulo', title: 'Título' },
        { id: 'descripcion', title: 'Descripción' },
        { id: 'estado', title: 'Estado' },
        { id: 'prioridad', title: 'Prioridad' },
        { id: 'proyecto', title: 'Proyecto' },
        { id: 'asignadoA', title: 'Asignado A' },
        { id: 'creadoPor', title: 'Creado Por' },
        { id: 'fechaVencimiento', title: 'Fecha Vencimiento' },
        { id: 'fechaCreacion', title: 'Fecha Creación' }
      ];
      filename = 'reporte_tareas.csv';
    } else if (type === 'projects') {
      const projects = await Project.find()
        .populate('createdBy', 'username')
        .populate('members', 'username');

      data = projects.map(project => ({
        id: project._id,
        nombre: project.name,
        descripcion: project.description,
        estado: project.status,
        creadoPor: project.createdBy?.username,
        miembros: project.members.map(m => m.username).join(', '),
        fechaInicio: project.startDate,
        fechaFin: project.endDate || '',
        fechaCreacion: project.createdAt
      }));

      headers = [
        { id: 'id', title: 'ID' },
        { id: 'nombre', title: 'Nombre' },
        { id: 'descripcion', title: 'Descripción' },
        { id: 'estado', title: 'Estado' },
        { id: 'creadoPor', title: 'Creado Por' },
        { id: 'miembros', title: 'Miembros' },
        { id: 'fechaInicio', title: 'Fecha Inicio' },
        { id: 'fechaFin', title: 'Fecha Fin' },
        { id: 'fechaCreacion', title: 'Fecha Creación' }
      ];
      filename = 'reporte_proyectos.csv';
    } else if (type === 'users') {
      const users = await User.find().select('-password');

      data = users.map(user => ({
        id: user._id,
        usuario: user.username,
        email: user.email,
        rol: user.role,
        fechaCreacion: user.createdAt
      }));

      headers = [
        { id: 'id', title: 'ID' },
        { id: 'usuario', title: 'Usuario' },
        { id: 'email', title: 'Email' },
        { id: 'rol', title: 'Rol' },
        { id: 'fechaCreacion', title: 'Fecha Creación' }
      ];
      filename = 'reporte_usuarios.csv';
    }

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '../../temp', filename),
      header: headers
    });

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    await csvWriter.writeRecords(data);

    res.download(path.join(__dirname, '../../temp', filename), filename, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up file after download
      setTimeout(() => {
        fs.unlinkSync(path.join(__dirname, '../../temp', filename));
      }, 1000);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

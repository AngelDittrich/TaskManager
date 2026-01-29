const express = require('express');
const Task = require('../models/Task');
const History = require('../models/History');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { project, status, assignedTo } = req.query;
    const filter = {};
    
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });
    await task.save();

    await History.create({
      action: 'Tarea creada',
      entityType: 'task',
      entityId: task._id,
      performedBy: req.user._id
    });

    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        title: 'Nueva tarea asignada',
        message: `Se te ha asignado la tarea: ${task.title}`,
        type: 'info',
        user: task.assignedTo,
        relatedEntity: 'task',
        relatedId: task._id
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    Object.assign(task, req.body);
    await task.save();

    await History.create({
      action: 'Tarea actualizada',
      entityType: 'task',
      entityId: task._id,
      changes: req.body,
      performedBy: req.user._id
    });

    if (req.body.status && req.body.status !== oldStatus && task.assignedTo) {
      await Notification.create({
        title: 'Estado de tarea actualizado',
        message: `La tarea "${task.title}" cambió a ${req.body.status}`,
        type: 'info',
        user: task.assignedTo,
        relatedEntity: 'task',
        relatedId: task._id
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await History.create({
      action: 'Tarea eliminada',
      entityType: 'task',
      entityId: task._id,
      performedBy: req.user._id
    });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

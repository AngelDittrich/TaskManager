const express = require('express');
const Project = require('../models/Project');
const History = require('../models/History');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'username')
      .populate('members', 'username')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('members', 'username');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user._id
    });
    await project.save();

    await History.create({
      action: 'Proyecto creado',
      entityType: 'project',
      entityId: project._id,
      performedBy: req.user._id
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'username')
      .populate('members', 'username');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, req.body);
    await project.save();

    await History.create({
      action: 'Proyecto actualizado',
      entityType: 'project',
      entityId: project._id,
      changes: req.body,
      performedBy: req.user._id
    });

    if (req.body.members) {
      const newMembers = req.body.members.filter(
        memberId => !project.members.includes(memberId)
      );
      
      for (const memberId of newMembers) {
        await Notification.create({
          title: 'Agregado a proyecto',
          message: `Has sido agregado al proyecto: ${project.name}`,
          type: 'info',
          user: memberId,
          relatedEntity: 'project',
          relatedId: project._id
        });
      }
    }

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'username')
      .populate('members', 'username');

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await History.create({
      action: 'Proyecto eliminado',
      entityType: 'project',
      entityId: project._id,
      performedBy: req.user._id
    });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

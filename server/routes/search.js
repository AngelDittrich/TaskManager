const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Global search
router.get('/', auth, async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    const results = {};

    if (!type || type === 'tasks') {
      results.tasks = await Task.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      })
        .populate('project', 'name')
        .populate('assignedTo', 'username')
        .limit(20);
    }

    if (!type || type === 'projects') {
      results.projects = await Project.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      })
        .populate('createdBy', 'username')
        .limit(20);
    }

    if (!type || type === 'comments') {
      results.comments = await Comment.find({
        content: searchRegex
      })
        .populate('createdBy', 'username')
        .populate('task', 'title')
        .populate('project', 'name')
        .limit(20);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

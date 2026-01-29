const express = require('express');
const Comment = require('../models/Comment');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all comments
router.get('/', auth, async (req, res) => {
  try {
    const { task, project } = req.query;
    const filter = {};
    
    if (task) filter.task = task;
    if (project) filter.project = project;

    const comments = await Comment.find(filter)
      .populate('createdBy', 'username')
      .populate('task', 'title')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const comment = new Comment({
      ...req.body,
      createdBy: req.user._id
    });
    await comment.save();

    await History.create({
      action: 'Comentario creado',
      entityType: 'comment',
      entityId: comment._id,
      performedBy: req.user._id
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('createdBy', 'username')
      .populate('task', 'title')
      .populate('project', 'name');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await History.create({
      action: 'Comentario eliminado',
      entityType: 'comment',
      entityId: comment._id,
      performedBy: req.user._id
    });

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

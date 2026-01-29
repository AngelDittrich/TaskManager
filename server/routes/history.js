const express = require('express');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all history
router.get('/', auth, async (req, res) => {
  try {
    const { entityType, entityId } = req.query;
    const filter = {};
    
    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;

    const history = await History.find(filter)
      .populate('performedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

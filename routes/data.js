const express = require('express');
const SharedData = require('../models/SharedData');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:teamId/:type', authMiddleware, async (req, res) => {
  try {
    const { teamId, type } = req.params;
    const data = await SharedData.findOne({ teamId, type });
    res.json(data || { data: {} });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:teamId/:type', authMiddleware, async (req, res) => {
  try {
    const { teamId, type } = req.params;
    const { data } = req.body;
    
    const sharedData = await SharedData.findOneAndUpdate(
      { teamId, type },
      { 
        data, 
        updatedBy: req.userId,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(sharedData);
  } catch (error) {
    console.error('Update data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
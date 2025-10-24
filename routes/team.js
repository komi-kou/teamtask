const express = require('express');
const Team = require('../models/Team');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.userId }).populate('members', 'username email');
    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const team = new Team({
      name,
      description,
      createdBy: req.userId,
      members: [req.userId]
    });

    await team.save();
    await team.populate('members', 'username email');
    
    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate('members', 'username email');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
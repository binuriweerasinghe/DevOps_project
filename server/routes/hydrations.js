// routes/hydrations.js
const express = require('express');
const router = express.Router();
const Hydration = require('../models/Hydration');

// GET /api/hydrations?userId=...
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const hydrations = await Hydration.find({ userId }).sort({ date: -1 });
    res.json(hydrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/hydrations
router.post('/', async (req, res) => {
  const { userId, amount, date } = req.body;
  if (!userId || !amount || !date) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hydration = new Hydration({
      userId,
      amount,
      date: new Date(date)
    });
    await hydration.save();
    res.json(hydration);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/hydrations/:id
router.delete('/:id', async (req, res) => {
  try {
    await Hydration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

// routes/workouts.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// GET /api/workouts?userId=...
router.get("/", async (req, res) => {
  const { userId } = req.query; // get userId from query
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/workouts
router.post("/", async (req, res) => {
  const { userId, name, date, sets, reps, duration, calories } = req.body;
  if (!userId || !name || !date) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const workout = new Workout({ userId, name, date, sets, reps, duration, calories });
    const saved = await workout.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

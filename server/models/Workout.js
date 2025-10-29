const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // <-- add this
  date: { type: Date, required: true },
  name: { type: String, required: true },
  sets: Number,
  reps: Number,
  duration: Number,
  calories: Number
});

module.exports = mongoose.model('Workout', workoutSchema);



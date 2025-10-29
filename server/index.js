const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db'); // connects to MongoDB

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const hydrationRoutes = require('./routes/hydrations');
const workoutRoutes = require('./routes/workouts');
const weightRoutes = require('./routes/weights');
app.use('/api/auth', authRoutes);
app.use('/api/hydrations', hydrationRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/weights', weightRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

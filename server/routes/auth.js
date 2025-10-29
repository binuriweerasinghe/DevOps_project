// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const newUser = new User({ username, email, password }); // pre('save') will hash the password
    await newUser.save();

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    console.log("User found: ", user.username);

    // Debugging: Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match: ", isMatch);  // Should log true if password matches

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ userId: user._id, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;



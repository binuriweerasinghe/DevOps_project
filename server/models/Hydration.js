// models/Hydration.js
const mongoose = require('mongoose');

const hydrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Hydration', hydrationSchema);


const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  kg: { type: Number, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model("Weight", weightSchema);




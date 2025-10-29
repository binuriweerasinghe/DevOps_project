const express = require("express");
const router = express.Router();
const Weight = require("../models/Weight");

// ✅ GET all weights for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const weights = await Weight.find({ userId }).sort({ date: 1 });
    res.json(weights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weights" });
  }
});

// ✅ POST new weight entry
router.post("/", async (req, res) => {
  try {
    const { date, kg, userId } = req.body;
    if (!date || !kg || !userId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newWeight = new Weight({ date, kg, userId });
    await newWeight.save();
    res.json(newWeight);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add weight entry" });
  }
});

// ✅ DELETE a weight entry
router.delete("/:id", async (req, res) => {
  try {
    await Weight.findByIdAndDelete(req.params.id);
    res.json({ message: "Weight entry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete weight entry" });
  }
});

module.exports = router;


module.exports = router;


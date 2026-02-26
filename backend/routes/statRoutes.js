const express = require("express");
const router = express.Router();
const Stat = require("../models/Stat");

// SECRET DEMO ROUTE: Wipe the stats clean!
router.get("/reset", async (req, res) => {
  try {
    await Stat.deleteMany({}); // Deletes the old saved stats
    const freshStats = await Stat.create({}); // Creates brand new ones starting at 0
    res.json({ message: "✅ Stats successfully wiped clean!", freshStats });
  } catch (error) {
    res.status(500).json({ error: "Reset failed" });
  }
});

// @route   GET /api/stats
// Desc     Get current user stats (creates default if none exist)
router.get("/", async (req, res) => {
  try {
    let stats = await Stat.findOne();
    // If no stats exist yet, create our default starting block
    if (!stats) {
      stats = await Stat.create({});
    }
    res.json(stats);
  } catch (error) {
    console.error("❌ Fetch Stats Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   PUT /api/stats/master-concept
// Desc     Add +1 to Concepts Mastered
router.put("/master-concept", async (req, res) => {
  try {
    let stats = await Stat.findOne();
    if (stats) {
      stats.conceptsMastered += 1; // 🚀 The magic level-up line!
      await stats.save();
    }
    res.json(stats);
  } catch (error) {
    console.error("❌ Update Stats Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

// @route   PUT /api/stats/add-time
// Desc     Add study time (in hours) to stats
router.put("/add-time", async (req, res) => {
  try {
    const { hours } = req.body;
    let stats = await Stat.findOne();

    if (stats) {
      // Add the new hours and round to 2 decimal places so we can see quick changes!
      stats.studyHours = Math.round((stats.studyHours + hours) * 100) / 100;
      await stats.save();
    }

    res.json(stats);
  } catch (error) {
    console.error("❌ Add Time Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

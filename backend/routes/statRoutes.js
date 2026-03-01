const express = require("express");
const router = express.Router();
const Stat = require("../models/Stat");
const { protect } = require("../middleware/authMiddleware");

// 🚀 All routes below this line require a valid login token
router.use(protect);

// SECRET DEMO ROUTE: Wipe the stats clean for the user!
router.get("/reset", async (req, res) => {
  try {
    await Stat.deleteMany({ user: req.user }); // Deletes the old saved stats for user
    const freshStats = await Stat.create({ user: req.user }); // Creates brand new ones starting at 0
    res.json({ message: "✅ Stats successfully wiped clean!", freshStats });
  } catch (error) {
    res.status(500).json({ error: "Reset failed" });
  }
});

// @route   GET /api/stats
// Desc     Get current user stats (creates default if none exist)
router.get("/", async (req, res) => {
  try {
    let stats = await Stat.findOne({ user: req.user });
    // If no stats exist yet, create our default starting block
    if (!stats) {
      stats = await Stat.create({ user: req.user });
    } else {
      // 🚀 Day Streak Logic
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of today

      const lastLogin = new Date(stats.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0); // Normalize to start of last login day

      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const daysDiff = Math.floor((today - lastLogin) / MS_PER_DAY);

      if (daysDiff === 1) {
        // Logged in yesterday -> streak continues!
        stats.dayStreak += 1;
        stats.lastLoginDate = new Date();
        await stats.save();
      } else if (daysDiff > 1) {
        // Missed a day -> reset streak to 1
        stats.dayStreak = 1;
        stats.lastLoginDate = new Date();
        await stats.save();
      }
      // If daysDiff === 0, they already logged in today, so do nothing.
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
    let stats = await Stat.findOne({ user: req.user });
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

// @route   PUT /api/stats/add-time
// Desc     Add study time (in hours) to stats
router.put("/add-time", async (req, res) => {
  try {
    const { hours } = req.body;
    let stats = await Stat.findOne({ user: req.user });

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

module.exports = router;

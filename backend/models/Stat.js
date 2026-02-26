const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  conceptsMastered: { type: Number, default: 0 }, 
  studyHours: { type: Number, default: 0 },
  activeCourses: { type: Number, default: 0 },
  dayStreak: { type: Number, default: 1 } // 1 because it's their first day!
});

module.exports = mongoose.model('Stat', statSchema);
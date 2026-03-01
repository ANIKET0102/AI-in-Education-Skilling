const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conceptsMastered: { type: Number, default: 0 },
  studyHours: { type: Number, default: 0 },
  activeCourses: { type: Number, default: 0 },
  dayStreak: { type: Number, default: 1 }, // 1 because it's their first day!
  lastLoginDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stat', statSchema);
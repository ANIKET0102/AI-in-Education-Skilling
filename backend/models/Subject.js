const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pdfPath: { type: String, required: true },
  // 🚀 This link is required for the controller to work
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    role: String,
    text: String,
    type: String, // 'quiz' etc
    data: mongoose.Schema.Types.Mixed // For quiz data
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);
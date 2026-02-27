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
  messages: [{ role: String, content: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);
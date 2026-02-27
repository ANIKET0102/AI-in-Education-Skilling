const Subject = require('../models/Subject');

/**
 * @desc    Get only the subjects belonging to the logged-in user
 * @route   GET /api/subjects
 */
exports.getSubjects = async (req, res) => {
  try {
    // req.user is populated by your protect middleware
    const subjects = await Subject.find({ user: req.user }); 
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your subjects" });
  }
};

/**
 * @desc    Create a new subject linked to the logged-in user
 * @route   POST /api/subjects
 */
exports.createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const pdfPath = req.file ? req.file.path : null;

    if (!pdfPath) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const newSubject = new Subject({
      name,
      pdfPath,
      user: req.user // 🚀 This is the "Owner" ID that keeps data private
    });

    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: "Error saving subject", error: error.message });
  }
};

// Add this to your existing subjectController.js
exports.saveMessages = async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Find the subject but ensure it belongs to the logged-in user
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { messages: messages },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found or unauthorized" });
    }

    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: "Server Error while saving messages" });
  }
};
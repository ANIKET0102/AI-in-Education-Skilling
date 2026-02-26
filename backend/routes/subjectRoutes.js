const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const upload = require("../middleware/upload");

// @route   POST /api/subjects
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    console.log("Incoming Subject Name:", req.body.name);
    console.log("Incoming File:", req.file);

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Subject name is required" });
    }

    const newSubject = new Subject({
      name: name,
      pdfPath: req.file ? req.file.path : null,
    });

    await newSubject.save();
    console.log("✅ Subject saved successfully!");
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("❌ CRITICAL BACKEND ERROR:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

// @route   GET /api/subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

// @route   PUT /api/subjects/:id/messages
// Desc     Save the chat history to a specific subject
router.put("/:id/messages", async (req, res) => {
  try {
    const { messages } = req.body;

    // Find the subject by its ID and update its messages array
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { messages: messages },
      { new: true }, // Return the newly updated document
    );

    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(updatedSubject);
  } catch (error) {
    console.error("❌ Save Messages Error:", error);
    res.status(500).json({ error: "Server Error while saving messages" });
  }
});

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const { 
  getSubjects, 
  createSubject, 
  saveMessages 
} = require("../controllers/subjectController");

// 🚀 All routes below this line require a valid login token
router.use(protect);

/**
 * @route   GET /api/subjects
 * @desc    Fetch only the logged-in user's subjects
 */
router.get("/", getSubjects);

/**
 * @route   POST /api/subjects
 * @desc    Create a new subject with PDF upload linked to the user
 */
router.post("/", upload.single("pdf"), createSubject);

/**
 * @route   PUT /api/subjects/:id/messages
 * @desc    Save chat history to a specific subject
 */
router.put("/:id/messages", saveMessages);

module.exports = router;
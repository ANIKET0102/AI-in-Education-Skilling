const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getSavedPlanner, 
  savePlanner 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Public route to create a new user profile
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Public route to authenticate existing users
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/planner
 * @desc    Protected route to retrieve the logged-in user's saved schedule
 */
router.get('/planner', protect, getSavedPlanner);

/**
 * @route   PUT /api/auth/planner
 * @desc    Protected route to save/update the user's study plan
 */
router.put('/planner', protect, savePlanner);

module.exports = router;
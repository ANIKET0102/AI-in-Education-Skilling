const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route for creating a new profile
router.post('/register', registerUser);

// Route for logging into an existing profile
router.post('/login', loginUser);

module.exports = router;
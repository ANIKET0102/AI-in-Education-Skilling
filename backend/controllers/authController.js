const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc    Generate a JWT Token
 * @param   {string} id - The MongoDB User ID
 * @returns {string} - A signed JWT
 */
const generateToken = (id) => {
  // Use the secret key from your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Keep the user logged in for 30 days
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validation: Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create User: Password hashing happens automatically via the User Model pre-save hook
    const user = await User.create({
      username,
      password,
    });

    // 3. Response: Send back user info and the digital "key" (token)
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find the user by username
    const user = await User.findOne({ username });

    // 2. Verify: Check if user exists AND if the password matches (using the comparePassword method in User Model)
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      // Security Tip: Use a generic error message so hackers don't know which part was wrong
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};
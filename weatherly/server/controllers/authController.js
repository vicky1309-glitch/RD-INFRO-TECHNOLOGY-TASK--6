const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email and password" });
  }

  const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
  if (userExists) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    user: user.toSafeObject(),
    token: generateToken(user.id),
  });
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    user: user.toSafeObject(),
    token: generateToken(user.id),
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

module.exports = { registerUser, loginUser, getMe };

const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/profile
const getProfile = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

// @desc    Update user profile / preferences
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  const { name, defaultCity, unit, theme, notificationsEnabled } = req.body;

  const user = req.user;

  if (name !== undefined) user.name = name;
  if (defaultCity !== undefined) user.defaultCity = defaultCity;
  if (unit !== undefined) user.unit = unit;
  if (theme !== undefined) user.theme = theme;
  if (notificationsEnabled !== undefined) user.notificationsEnabled = notificationsEnabled;

  await user.save();

  res.json({ user: user.toSafeObject() });
};

module.exports = { getProfile, updateProfile };

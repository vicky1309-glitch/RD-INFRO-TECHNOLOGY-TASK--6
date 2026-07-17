const Favorite = require("../models/Favorite");

// @desc    Get all favorite cities for logged in user
// @route   GET /api/favorites
const getFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({
    where: { userId: req.user.id },
    order: [
      ["isPinned", "DESC"],
      ["createdAt", "DESC"],
    ],
  });
  res.json({ favorites });
};

// @desc    Add a favorite city
// @route   POST /api/favorites
const addFavorite = async (req, res) => {
  const { city, country, lat, lon } = req.body;

  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  const exists = await Favorite.findOne({ where: { userId: req.user.id, city } });
  if (exists) {
    return res.status(400).json({ message: "City is already in favorites" });
  }

  const favorite = await Favorite.create({
    userId: req.user.id,
    city,
    country,
    lat,
    lon,
  });

  res.status(201).json({ favorite });
};

// @desc    Remove a favorite city
// @route   DELETE /api/favorites/:id
const removeFavorite = async (req, res) => {
  const favorite = await Favorite.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!favorite) {
    return res.status(404).json({ message: "Favorite not found" });
  }

  await favorite.destroy();
  res.json({ message: "Favorite removed", id: req.params.id });
};

// @desc    Pin a favorite city as default
// @route   PUT /api/favorites/:id/pin
const pinFavorite = async (req, res) => {
  await Favorite.update({ isPinned: false }, { where: { userId: req.user.id } });

  const [updatedCount] = await Favorite.update(
    { isPinned: true },
    { where: { id: req.params.id, userId: req.user.id } }
  );

  if (!updatedCount) {
    return res.status(404).json({ message: "Favorite not found" });
  }

  const favorite = await Favorite.findByPk(req.params.id);
  res.json({ favorite });
};

module.exports = { getFavorites, addFavorite, removeFavorite, pinFavorite };

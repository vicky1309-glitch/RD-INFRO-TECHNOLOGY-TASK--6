const express = require("express");
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  pinFavorite,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getFavorites).post(protect, addFavorite);
router.delete("/:id", protect, removeFavorite);
router.put("/:id/pin", protect, pinFavorite);

module.exports = router;

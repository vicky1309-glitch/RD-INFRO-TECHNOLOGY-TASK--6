const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    timestamps: true,
    indexes: [{ unique: true, fields: ["userId", "city"] }],
  }
);

// A user has many favorite cities; each favorite belongs to one user.
User.hasMany(Favorite, { foreignKey: "userId", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "userId" });

module.exports = Favorite;

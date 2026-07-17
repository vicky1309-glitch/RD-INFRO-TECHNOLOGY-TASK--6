const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

class User extends Model {
  async matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      defaultCity: this.defaultCity,
      unit: this.unit,
      theme: this.theme,
      notificationsEnabled: this.notificationsEnabled,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { notEmpty: { msg: "Name is required" } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "Please provide a valid email" } },
      set(value) {
        this.setDataValue("email", value.trim().toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: { args: [6, 255], msg: "Password must be at least 6 characters" } },
    },
    defaultCity: {
      type: DataTypes.STRING,
      defaultValue: "Chennai",
    },
    unit: {
      type: DataTypes.ENUM("metric", "imperial"),
      defaultValue: "metric",
    },
    theme: {
      type: DataTypes.ENUM("default", "dark", "ocean", "sunset"),
      defaultValue: "default",
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;

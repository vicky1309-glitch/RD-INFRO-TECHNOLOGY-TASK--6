const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? false : false,
    define: {
      underscored: false,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL connected: ${process.env.DB_HOST}/${process.env.DB_NAME}`);

    // Creates/updates tables to match the models below. Fine for development;
    // for production, prefer proper migrations (e.g. sequelize-cli) instead
    // of alter-sync.
    await sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
    console.log("Database synced");
  } catch (error) {
    console.error(`MySQL connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

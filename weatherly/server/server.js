require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

connectDB();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Basic rate limiting to protect the OpenWeather quota
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Wrap async route handlers so thrown errors reach errorHandler
const wrapAsync = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const wrapRouter = (router) => {
  router.stack.forEach((layer) => {
    if (layer.route) {
      layer.route.stack.forEach((routeLayer) => {
        routeLayer.handle = wrapAsync(routeLayer.handle);
      });
    }
  });
  return router;
};

app.use("/api/auth", wrapRouter(authRoutes));
app.use("/api/users", wrapRouter(userRoutes));
app.use("/api/favorites", wrapRouter(favoriteRoutes));
app.use("/api/weather", wrapRouter(weatherRoutes));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "weatherly-api" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Weatherly API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

const errorHandler = require("./middlewares/errorHandlerMiddleware");
const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const tripRoutes = require("./routes/tripRoutes");
const tireRoutes = require("./routes/tireRoutes");

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tires", tireRoutes);

app.get("/", (req, res) => {
  res.send("FleetTrack API is running ...");
});

// Middleware de gestion des erreurs
app.use(errorHandler);

module.exports = app;

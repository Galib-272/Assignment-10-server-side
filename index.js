require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const auth = require("./config/auth"); 
const { toNodeHandler } = require("better-auth/node");

const app = express();

// Initialize Database Connection
connectDB();

// Global CORS Middleware
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

// --- BETTER-AUTH PASSTHROUGH (Sits before body-parsers to avoid stream locking) ---
app.use("/api/auth", (req, res, next) => {
  // If it's hitting your traditional manual local endpoints, skip Better-Auth
  if (req.url === "/login" || req.url === "/register") {
    return next();
  }
  return toNodeHandler(auth)(req, res);
});

// Standard Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Custom Traditional Route Endpoints
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tickets", require("./routes/tickets"));

// Root Validation Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to TicketBari REST API Engine!" });
});

// Port Execution Configuration
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🔥 Local testing active on port http://localhost:${PORT}`);
  });
}

module.exports = app;
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const auth = require("./config/auth"); // Imported Better-Auth backend configuration module

const app = express();

// Initialize Database Connection
connectDB();

// Global Middleware Configs
app.use(cors());
app.use(express.json());

// Mount Custom Traditional Route Endpoints
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tickets", require("./routes/tickets"));

// --- MOUNT BETTER-AUTH SERVERLESS CATCH-ALL MIDDLEWARE ---
// Fixed: Switched from app.all() with a wildcard to app.use() to support Express 5+ path parsing
app.use("/api/auth", async (req, res, next) => {
  // Skip if it's hitting your traditional manual routes precisely
  if (req.path === "/login" || req.path === "/register") {
    return next();
  }

  try {
    const authResponse = await auth.handler(req);
    return res.status(authResponse.status).send(authResponse.body);
  } catch (error) {
    console.error("Better-Auth Gateway Engine Error:", error);
    return res.status(500).json({ message: "Internal Auth Gateway Engine Processing Failure" });
  }
});

// Root Validation Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to TicketBari REST API Engine running on Vercel Serverless!" });
});

// Port Execution Configuration (Needed for local development)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🔥 Local testing active on port http://localhost:${PORT}`);
  });
}

// CRITICAL FOR VERCEL SERVERLESS: Export the app module
module.exports = app;
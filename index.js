require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");

const app = express();

// Initialize Database Connection
connectDB();

// Global Middleware Configs
app.use(cors());
app.use(express.json());

// Mount Route App Endpoints
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tickets", require("./routes/tickets"));

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
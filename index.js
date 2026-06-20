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

// Root Validation Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to TicketBari REST API Engine v1.0.0" });
});

// Port Execution Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Express Application Node operational on port http://localhost:${PORT}`);
});
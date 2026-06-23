const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @route   POST /api/auth/register
// @desc    Register a new user account profile
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Structural Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill out all required validation blocks." });
    }

    // 2. Check if user credentials already exist in database storage
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res
        .status(400)
        .json({ message: "This email address is already registered." });
    }

    // 3. Create fresh template instantiation
    user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "User", // Defaults to normal passenger profile
    });

    // 4. Encrypt password safety hash block
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Commit profile to MongoDB cluster
    await user.save();

    // 6. Generate tracking access token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Active session context valid for 7 days
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Core Fault:", error);
    res.status(500).json({ message: "Server encountered a processing error." });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate credentials and issue session access tokens
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password inputs are mandatory." });
    }

    // 1. Query for target identity matching profile
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid combination parameters entered." });
    }

    // 2. Compare user typed plaintext string against hashed store parameters
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid combination parameters entered." });
    }

    // 3. Sign fresh verification runtime context token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Core Fault:", error);
    res.status(500).json({ message: "Server encountered a processing error." });
  }
});

module.exports = router;

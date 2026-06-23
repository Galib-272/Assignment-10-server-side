const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

// @route   POST /api/tickets/create
// @desc    Create a new transport route ticket listing (Vendor Action)
router.post("/create", async (req, res) => {
  try {
    const { title, from, to, transportType, price, availableSeats, vendorId } =
      req.body;

    // Validation Check
    if (!title || !from || !to || !transportType || !price || !availableSeats) {
      return res
        .status(400)
        .json({ message: "All listing parameters are required." });
    }

    // Instantiate a new Ticket document based on our Mongoose Model
    const newTicket = new Ticket({
      title,
      from,
      to,
      transportType,
      price,
      availableSeats,
      status: "Pending", // Requires Admin approval before going live
      vendorId,
    });

    // Save the ticket into your MongoDB Atlas cluster
    const savedTicket = await newTicket.save();
    res
      .status(201)
      .json({ message: "Ticket submitted successfully!", ticket: savedTicket });
  } catch (error) {
    console.error("Ticket Creation Error:", error);
    res.status(500).json({ message: "Server error failed to save ticket." });
  }
});

// @route   GET /api/tickets/live
// @desc    Get all approved tickets for passengers to search and filter
router.get("/live", async (req, res) => {
  try {
    // Find all tickets where status is "Approved"
    const liveTickets = await Ticket.find({ status: "Approved" });
    res.json(liveTickets);
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    res
      .status(500)
      .json({ message: "Server error failed to retrieve listings." });
  }
});

module.exports = router;

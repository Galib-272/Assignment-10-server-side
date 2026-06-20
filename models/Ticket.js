const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  transportType: { type: String, enum: ["Bus", "Train", "Plane"], required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
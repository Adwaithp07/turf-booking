const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  turfId: String,
  turfName: String,
  date: String,
  userId: String,
  timeSlot: String
});

module.exports = mongoose.model("Booking", bookingSchema);
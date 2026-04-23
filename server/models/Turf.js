const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  name: String,
  location: String,
  pricePerHour: Number,
  image: String
});

module.exports = mongoose.model("Turf", turfSchema);
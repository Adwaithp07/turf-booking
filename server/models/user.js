const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    default: "user"
  },
  assignedTurf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (FIXED)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/turfs", require("./routes/turfRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bookings", bookingRoutes);

// Start server (FIXED)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
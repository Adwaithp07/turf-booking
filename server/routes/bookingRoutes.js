const router = require("express").Router();
const Booking = require("../models/Booking");


// Create Booking (with validation)
router.post("/", async (req, res) => {
  const { turfId, date, timeSlot } = req.body;

  const exists = await Booking.findOne({ turfId, date, timeSlot });

  if (exists) {
    return res.status(400).json({ message: "Slot already booked" });
  }

  const booking = await Booking.create(req.body);
  res.json(booking);
});

router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔹 Convert booking date + time to Date object
    const bookingDateTime = new Date(`${booking.date} ${booking.timeSlot.split(" - ")[0]}`);

    const now = new Date();

    // 🔹 Difference in hours
    const diffHours = (bookingDateTime - now) / (1000 * 60 * 60);

    let refundMessage = "";

    if (diffHours <= 12) {
      refundMessage = "⚠️ Only 50% refund (cancelled within 12 hours)";
    } else {
      refundMessage = "✅ Full refund";
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking cancelled",
      refund: refundMessage
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// Get all bookings
router.get("/:userId", async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.userId });
  res.json(bookings);
});

// Get booked slots for turf
router.get("/:turfId/:date", async (req, res) => {
  const bookings = await Booking.find({
    turfId: req.params.turfId,
    date: req.params.date
  });

  const slots = bookings.map(b => b.timeSlot);
  res.json(slots);
});

module.exports = router;
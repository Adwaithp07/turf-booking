import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [turf, setTurf] = useState(null);

  // ✅ Time slots with AM/PM clarity
  const slots = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
    "9:00 PM - 10:00 PM",
  ];

  useEffect(() => {
  axios
    .get(`http://localhost:5000/api/turfs/${id}`)
    .then((res) => setTurf(res.data))
    .catch((err) => console.log(err));
}, [id]);

  // 🔹 Fetch booked slots for selected date
  useEffect(() => {
    if (date) {
      axios
        .get(`http://localhost:5000/api/bookings/${id}/${date}`)
        .then((res) => setBookedSlots(res.data))
        .catch((err) => console.log(err));
    }
  }, [date, id]);

  // 🔹 Booking function
  const handleBooking = () => {
    // Login check
    if (!user) {
      toast.error("Please login first");
      return navigate("/login");
    }

    // Validation
    if (!date || !timeSlot) {
      return toast.error("Please select date & time");
    }

    if (!turf) {
  toast.error("Turf not loaded yet");
  return;
}

    setLoading(true);

    // Fake payment delay
    setTimeout(async () => {
      try {
   await axios.post("http://localhost:5000/api/bookings", {
  turfId: id,
  turfName: turf.name,
  image: turf.image,   // ✅ ADD THIS
  date,
  timeSlot,
  userId: user._id
});

        toast.success("Payment Successful & Booking Confirmed ✅");

        navigate("/bookings");
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Booking failed");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const isPastSlot = (slot) => {
  if (!date) return false;

  const now = new Date();

  // Extract start time (e.g. "7:00 PM")
  const startTime = slot.split(" - ")[0];

  const slotDateTime = new Date(`${date} ${startTime}`);

  return slotDateTime <= now; // already started or past
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">

      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold mb-5 text-center">
          🏟️ Book Turf
        </h2>

        {/* Date */}
        <label className="block mb-2 font-semibold">Select Date</label>
        <input
          type="date"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Time */}
        <label className="block mb-2 font-semibold">Select Time Slot</label>
        <select
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="">-- Select Time --</option>

          {slots.map((slot) => (
        <option
  key={slot}
  value={slot}
  disabled={bookedSlots.includes(slot) || isPastSlot(slot)}>
  {slot} 
  {bookedSlots.includes(slot) ? "(Booked)" : ""}
  {isPastSlot(slot) ? " (Expired)" : ""}
</option>
          ))}
        </select>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          {loading ? "Processing Payment..." : "Pay & Book"}
        </button>
        

      </div>
    </div>
  );
}

export default Booking;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import turfImage from "../assets/turf.jpg"; // fallback image

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ✅ FETCH BOOKINGS
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:5000/api/bookings/${user._id}`)
        .then((res) => setBookings(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  // ✅ DELETE BOOKING
  const deleteBooking = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/bookings/${id}`
      );

      setBookings((prev) => prev.filter((b) => b._id !== id));

      toast.success(res.data.refund || "Booking Cancelled");
    } catch (err) {
      console.log(err);
      toast.error("Failed to cancel");
    }
  };

  // ✅ REFUND LOGIC
  const getRefundMessage = (booking) => {
    const bookingDateTime = new Date(
      `${booking.date} ${booking.timeSlot.split(" - ")[0]}`
    );

    const now = new Date();
    const diffHours = (bookingDateTime - now) / (1000 * 60 * 60);

    if (diffHours <= 12) {
      return "⚠️ Only 50% refund (within 12 hrs)";
    } else {
      return "✅ Full refund";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {/* EMPTY STATE */}
      {bookings.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-600">
            No bookings yet 😔
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Book a Turf
          </button>
        </div>
      ) : (

        /* BOOKINGS GRID */
        <div className="grid md:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >

              {/* IMAGE */}
              <div className="relative">
                <img
                  src={b.image || turfImage}
                  alt="turf"
                  className="w-full h-44 object-cover"
                />

                {/* STATUS BADGE */}
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Active
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* TURF NAME */}
                <h2 className="text-lg font-bold mb-1">
                  {b.turfName || "Football Turf"}
                </h2>

                {/* LOCATION (static for now) */}
                <p className="text-gray-500 text-sm mb-2">
                  📍 Kochi
                </p>

                {/* DATE & TIME */}
                <div className="text-sm mb-3">
                  <p>📅 {b.date}</p>
                  <p>⏰ {b.timeSlot}</p>
                </div>

                {/* PRICE (optional static) */}
                <p className="text-green-600 font-semibold mb-3">
                  ₹800
                </p>

                {/* CANCEL BUTTON */}
                <button
                  onClick={() => {
                    setSelectedId(b._id);
                    setSelectedBooking(b);
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ MODAL */}
      {selectedId && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">

            <h2 className="text-lg font-bold mb-2">
              Cancel Booking?
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {getRefundMessage(selectedBooking)}
            </p>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await deleteBooking(selectedId);
                  setSelectedId(null);
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Yes, Cancel
              </button>

              <button
                onClick={() => {
                  setSelectedId(null);
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Keep Booking
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
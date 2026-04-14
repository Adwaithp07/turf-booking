import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:5000/api/bookings/${user._id}`)
        .then((res) => setBookings(res.data));
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

  // ✅ REFUND LOGIC (SHOW BEFORE CANCEL)
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
{bookings.map((b) => (
  <div key={b._id} className="bg-white p-4 rounded shadow">

    <img
      src={b.image || "client/src/assets/Turf.jpg"}
      alt="turf"
      className="w-full h-40 object-cover rounded mb-2"
    />

    <p><b>Date:</b> {b.date}</p>
    <p><b>Time:</b> {b.timeSlot}</p>

              {/* ✅ CANCEL BUTTON */}
              <button
                onClick={() => {
                  setSelectedId(b._id);
                  setSelectedBooking(b);
                }}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ MODAL */}
      {selectedId && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded text-center w-80">
            <h2 className="mb-2 font-bold text-lg">
              Cancel this booking?
            </h2>

            {/* ✅ SHOW REFUND MESSAGE */}
            <p className="mb-4 text-sm text-gray-600">
              {getRefundMessage(selectedBooking)}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={async () => {
                  await deleteBooking(selectedId);
                  setSelectedId(null);
                  setSelectedBooking(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  setSelectedId(null);
                  setSelectedBooking(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
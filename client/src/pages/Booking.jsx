import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import turfImage from "../assets/turf.jpg";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [turf, setTurf] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // 💳 PAYMENT STATES
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardType, setCardType] = useState("");
  const [showFullCard, setShowFullCard] = useState(true);

  // ✅ TIME SLOTS
  const slots = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
    "9:00 PM - 10:00 PM",
  ];

  // ✅ FETCH TURF
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/turfs/${id}`)
      .then((res) => setTurf(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // ✅ FETCH BOOKED SLOTS
  useEffect(() => {
    if (date) {
      axios
        .get(`http://localhost:5000/api/bookings/${id}/${date}`)
        .then((res) => setBookedSlots(res.data))
        .catch((err) => console.log(err));
    }
  }, [date, id]);

  // ✅ PAST SLOT CHECK
  const isPastSlot = (slot) => {
    if (!date) return false;
    const now = new Date();
    const startTime = slot.split(" - ")[0];
    const slotDateTime = new Date(`${date} ${startTime}`);
    return slotDateTime <= now;
  };

  // 💳 MASK CARD
  const getMaskedCard = () => {
    const raw = cardNumber.replace(/\s/g, "");
    if (raw.length < 16) return cardNumber;
    return "**** **** **** " + raw.slice(-4);
  };

  // 💳 EXPIRY VALIDATION
  const isValidExpiry = () => {
    if (expiry.length !== 5) return false;

    const [month, year] = expiry.split("/");
    const m = parseInt(month);
    const y = parseInt(year);

    if (m < 1 || m > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (y < currentYear) return false;
    if (y === currentYear && m < currentMonth) return false;

    return true;
  };

  const isValidCard = cardNumber.replace(/\s/g, "").length === 16;
  const isValidCvv = cvv.length === 3;

  // ✅ FINAL BOOKING
  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login first");
      return navigate("/login");
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        await axios.post("http://localhost:5000/api/bookings", {
          turfId: id,
          turfName: turf.name,
          image: turf.image,
          date,
          timeSlot,
          userId: user._id,
        });

        toast.success("Payment Successful & Booking Confirmed ✅");
        navigate("/bookings");
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Booking failed");
      } finally {
        setLoading(false);
        setShowPayment(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-96 p-6">

        <img
          src={turf?.image || turfImage}
          alt="turf"
          className="w-full h-40 object-cover rounded mb-4"
        />

        <h2 className="text-2xl font-bold mb-4 text-center">
          Book {turf?.name}
        </h2>

        {/* DATE */}
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setDate(e.target.value)}
        />

        {/* SLOTS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {slots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isExpired = isPastSlot(slot);
            const isSelected = timeSlot === slot;

            return (
              <button
                key={slot}
                onClick={() =>
                  !isBooked && !isExpired && setTimeSlot(slot)
                }
                disabled={isBooked || isExpired}
                className={`p-2 rounded-lg text-sm
                  ${isBooked ? "bg-red-300" : ""}
                  ${isExpired ? "bg-gray-300" : ""}
                  ${isSelected ? "bg-green-500 text-white" : ""}
                  ${
                    !isBooked && !isExpired && !isSelected
                      ? "bg-white border hover:bg-blue-100"
                      : ""
                  }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={() => {
            if (!date || !timeSlot) {
              return toast.error("Select date & time");
            }
            setShowPayment(true);
          }}
          className="w-full bg-green-500 text-white py-2 rounded-lg"
        >
          Proceed to Pay
        </button>
      </div>

      {/* 💳 PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-2xl w-80">

            {/* 🎨 CARD PREVIEW */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-xl mb-4">

              <div className="flex justify-between mb-4">
                <span>{cardType || "Card"}</span>
              </div>

              <div
                onClick={() => setShowFullCard(!showFullCard)}
                className="text-lg tracking-widest mb-4"
              >
                {showFullCard
                  ? cardNumber || "**** **** **** ****"
                  : getMaskedCard()}
              </div>

              <div className="flex justify-between text-sm">
                <span>{expiry || "MM/YY"}</span>
                <span>{cvv ? "***" : "CVV"}</span>
              </div>
            </div>

            {/* CARD INPUT */}
            <input
              placeholder="Card Number"
              value={cardNumber}
              onFocus={() => setShowFullCard(true)}
              onBlur={() => setShowFullCard(false)}
              onChange={(e) => {
                let value = e.target.value;

                value = value.replace(/\D/g, "");
                value = value.slice(0, 16);

                if (value.startsWith("4")) setCardType("Visa");
                else if (/^5[1-5]/.test(value)) setCardType("MasterCard");
                else setCardType("");

                value = value.replace(/(.{4})/g, "$1 ").trim();

                setCardNumber(value);
              }}
              className="w-full border p-2 mb-2 rounded"
            />

            {/* EXPIRY */}
            <input
              placeholder="MM/YY"
              value={expiry}
              maxLength={5}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                value = value.slice(0, 4);

                if (value.length >= 2) {
                  let m = parseInt(value.slice(0, 2));
                  if (m === 0) value = "01" + value.slice(2);
                  else if (m > 12) value = "12" + value.slice(2);
                }

                if (value.length > 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2);
                }

                setExpiry(value);
              }}
              className="w-full border p-2 mb-2 rounded"
            />

            {/* CVV */}
            <input
              placeholder="CVV"
              value={cvv}
              maxLength={3}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, ""))
              }
              className="w-full border p-2 mb-2 rounded"
            />

            {/* PAY */}
            <button
              onClick={() => {
                if (!isValidCard)
                  return toast.error("Invalid card number");
                if (!isValidExpiry())
                  return toast.error("Invalid expiry");
                if (!isValidCvv)
                  return toast.error("Invalid CVV");

                handleBooking();
              }}
              className="w-full bg-green-500 text-white py-2 rounded mt-2"
            >
              {loading ? "Processing..." : "Pay ₹800"}
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-2 text-gray-500"
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
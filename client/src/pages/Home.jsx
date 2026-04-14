import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import turfImage from "../assets/turf.jpg";

function Home() {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch all turfs
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/turfs")
      .then((res) => setTurfs(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        ⚽ Available Turfs
      </h1>

      {/* Turf Cards */}
      {turfs.length === 0 ? (
        <p className="text-center text-gray-600">No turfs available</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {turfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition"
            >
              {/* Image */}
             <img
             src={turf.image || turfImage}
             alt={turf.name}
             className="h-48 w-full object-cover"
            />

              {/* Content */}
              <div className="p-5">
                <h2 className="text-xl font-bold mb-1">
                  {turf.name}
                </h2>

                <p className="text-gray-600">
                  📍 {turf.location}
                </p>

                <p className="text-green-600 font-semibold mt-2">
                  ₹{turf.pricePerHour} / hour
                </p>

                {/* Button */}
                <button
                  onClick={() => navigate(`/book/${turf._id}`)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;
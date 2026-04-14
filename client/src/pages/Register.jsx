import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

const handleSubmit = async () => {
  try {
    await axios.post("http://localhost:5000/api/users/register", data);
    alert("Registered!");
    navigate("/login");
  } catch (err) {
    console.log("ERROR:", err.response || err.message); // 👈 IMPORTANT
    alert("Error registering");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input placeholder="Name" onChange={e => setData({...data, name:e.target.value})} className="w-full border p-2 mb-2"/>
        <input placeholder="Email" onChange={e => setData({...data, email:e.target.value})} className="w-full border p-2 mb-2"/>
        <input type="password" placeholder="Password" onChange={e => setData({...data, password:e.target.value})} className="w-full border p-2 mb-2"/>

        <button
  type="button"
  onClick={handleSubmit}
  className="w-full bg-blue-500 text-white py-2 rounded">
  Register
</button>
      </div>
    </div>
  );
}

export default Register;
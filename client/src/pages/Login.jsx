import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", data);

      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input placeholder="Email" onChange={e => setData({...data, email:e.target.value})} className="w-full border p-2 mb-2"/>
        <input type="password" placeholder="Password" onChange={e => setData({...data, password:e.target.value})} className="w-full border p-2 mb-2"/>

        <button onClick={handleLogin} className="w-full bg-green-500 text-white py-2">Login</button>
      </div>
    </div>
  );
}

export default Login;
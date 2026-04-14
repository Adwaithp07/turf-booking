import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">⚽ TurfBook</h1>

      <div className="flex items-center gap-5">
        <Link to="/">Home</Link>

        {user && <Link to="/bookings">My Bookings</Link>}

        {user && <span className="font-semibold">Hi, {user.name}</span>}

        {!user ? (
          <Link className="bg-blue-500 text-white px-3 py-1 rounded" to="/login">
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
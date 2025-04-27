import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUser, logoutUser } from "../redux/auth/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  // console.log(user)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const randomQuotes = [
    "Stay hungry. Stay foolish. - Steve Jobs",
    "Consistency beats motivation.",
    "The best time to start was yesterday. The next best time is now.",
    "Small steps every day.",
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    dispatch(getUser());
    setQuote(randomQuotes[Math.floor(Math.random() * randomQuotes.length)]);
  }, [dispatch]);

  const handleLogout = async() => {
    await dispatch(logoutUser());
    // toast.success("Logged out successfully!");
    navigate("/login-user");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {user?.fullname} 👋
        </h1>
        <div className="flex items-center gap-4">
          {/* Settings icon */}
          <button className="text-gray-600 hover:text-gray-800">
            <i className="fas fa-cog"></i>
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8 flex items-center gap-6">
        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
          {user?.fullname?.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user?.fullname}</h2>
          <p className="text-gray-600">{user?.email}</p>
          {/* <p className="text-gray-500 text-sm">Joined: Jan 2024</p> */}
        </div>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="italic">"{quote}"</p>
      </div>
    </div>
  );
};

export default Dashboard;
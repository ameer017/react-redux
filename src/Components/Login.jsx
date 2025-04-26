import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs"; 

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const [loginData, updateLoginData] = useState(initialState);
  const { email, password } = loginData;
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Fill in all fields, don't be lazy.");
      return;
    }

    const savedUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (!savedUsers.length) {
      toast.error("No users found. Please register first.");
      return;
    }

    const foundUser = savedUsers.find((user) => user.email === email);

    if (!foundUser) {
      setEmailError("Email not found.");
      toast.error("Wrong email.");
      return;
    } else {
      setEmailError("");
    }

    // 🔥 Compare passwords properly using bcrypt
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      setPasswordError("Incorrect password.");
      toast.error("Wrong password.");
      return;
    } else {
      setPasswordError("");
    }

    login(foundUser);
    toast.success("Welcome back!");
    navigate("/profile");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`w-full p-2 border rounded mb-4 ${
            emailError ? "border-red-500" : ""
          }`}
          value={email}
          onChange={handleInputChange}
        />
        {emailError && <p className="text-red-500">{emailError}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className={`w-full p-2 border rounded mb-6 ${
            passwordError ? "border-red-500" : ""
          }`}
          value={password}
          onChange={handleInputChange}
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="mt-4">
          Don't have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

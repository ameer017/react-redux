import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../redux/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const [loginData, updateLoginData] = useState(initialState);
  const { email, password } = loginData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError } = useSelector((state) => state.auth);

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

    const userData = {
      email,
      password,
    };
    await dispatch(loginUser(userData));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/profile");
    }

    if (isError) {
      return;
    }

    dispatch(resetAuthState());
  }, [isSuccess, dispatch, navigate, isError]);

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
          className="w-full p-2 border rounded mb-6"
          value={email}
          onChange={handleInputChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-6"
          value={password}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLoading ? "Logging in..." : "Login"}
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

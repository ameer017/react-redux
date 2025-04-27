import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAuthState } from "../redux/auth/authSlice";

const Register = () => {
  const initialState = {
    fullname: "",
    email: "",
    password: "",
    password2: "",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const { fullname, email, password, password2 } = formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInput = () => {
    if (!fullname || !email || !password || !password2) {
      toast.error("Don't try to cheat. Fill everything.");
      return false;
    }

    if (password.length < 6) {
      // toast.error("Password must be at least 6 characters long");
      setPwdError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== password2) {
      // toast.error("Passwords don't match");
      setPwdError("Passwords don't match");
      return false;
    }

    return true;
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    const isValid = validateInput();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = { fullname, email, password: hashedPassword };

      // Dispatch the registerUser action to store user data in Redux
      await dispatch(registerUser(newUser));

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/profile");
    }

    dispatch(resetAuthState());
  }, [isSuccess, dispatch, navigate]);

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          className="bg-white p-8 rounded-lg shadow-md w-96"
          onSubmit={handleSubmitData}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full p-2 border rounded mb-4"
            value={fullname}
            onChange={handleInputChange}
            name="fullname"
          />
          <input
            type="email"
            placeholder="yourname@gmail.com"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={handleInputChange}
            name="email"
          />
          <input
            type="password"
            placeholder="Password"
            className={
              pwdError
                ? "w-full p-2 border  mb-6 rounded border-red-500"
                : "w-full p-2 border rounded mb-6"
            }
            value={password}
            onChange={handleInputChange}
            name="password"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={
              pwdError
                ? "w-full p-2 border mb-6 rounded border-red-500"
                : "w-full p-2 border rounded mb-6"
            }
            value={password2}
            onChange={handleInputChange}
            name="password2"
          />

          <p className="text-red-500">{pwdError}</p>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            {isSubmitting ? "Setting you up..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;

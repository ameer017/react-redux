import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";

const Register = () => {
  const initialState = {
    fullname: "",
    email: "",
    password: "",
    password2: "",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { fullname, email, password, password2 } = formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInput = () => {
    if (
      !formData.fullname ||
      !formData.email ||
      !formData.password ||
      !formData.password2
    ) {
      toast.error("Don't try to cheat. Fill everything.");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setPwdError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.password2) {
      toast.error("Passwords don't match");
      setPwdError("Passwords don't match");
      return false;
    }

    return true;
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    const isValid = validateInput();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const existingUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const emailExists = existingUsers.some((user) => user.email === email);

      if (emailExists) {
        toast.error("A user with this email already exists. Try logging in.");
        setIsSubmitting(false);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = { fullname, email, password: hashedPassword };

      const updatedUsers = [...existingUsers, newUser];

      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      setIsSubmitting(false);
      navigate("/profile");
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

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

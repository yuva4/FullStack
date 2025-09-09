import React, { useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        formData
      );

      console.log(response.data);
      setMessage("✅ Registration Successful!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Registration Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#192338] via-[#1E2E4F] to-[#31487A]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#D9E1F1]/95 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[#192338] drop-shadow">
          📝 Code Quest Register
        </h2>

        {/* First Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="border border-[#31487A] rounded-lg px-4 py-3 mb-3 w-full text-[#192338] placeholder-[#1E2E4F] focus:outline-none focus:ring-2 focus:ring-[#31487A]"
          required
        />

        {/* Last Name */}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border border-[#31487A] rounded-lg px-4 py-3 mb-3 w-full text-[#192338] placeholder-[#1E2E4F] focus:outline-none focus:ring-2 focus:ring-[#31487A]"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-[#31487A] rounded-lg px-4 py-3 mb-3 w-full text-[#192338] placeholder-[#1E2E4F] focus:outline-none focus:ring-2 focus:ring-[#31487A]"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-[#31487A] rounded-lg px-4 py-3 mb-5 w-full text-[#192338] placeholder-[#1E2E4F] focus:outline-none focus:ring-2 focus:ring-[#31487A]"
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-[#8FB3E2] to-[#D9E1F1] text-[#192338] px-4 py-3 rounded-lg w-full font-semibold shadow-md hover:opacity-90 hover:scale-105 transition-transform"
        >
          🚀 Register
        </button>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm font-medium text-[#1E2E4F]">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;

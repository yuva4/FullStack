import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
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
        `${BACKEND_URL}/api/auth/login`,
        formData
      );

      console.log(response.data);
      setMessage("✅ Login Successful!");

      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("role", response.data.role, { expires: 7 });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setIsLoggedIn(true);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setMessage(
        `❌ Login Failed: ${
          error.response ? error.response.data.error : error.message
        }`
      );
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
          🔑 Code Quest Login
        </h2>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-[#31487A] rounded-lg px-4 py-3 mb-3 w-full text-[#192338] placeholder-[#1E2E4F] focus:outline-none focus:ring-2 focus:ring-[#31487A]"
          required
        />

        {/* Password Input */}
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
          🚀 Login
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

export default Login;

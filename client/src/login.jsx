import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, formData);

      console.log(response.data);
      setMessage('✅ Login Successful!');
      Cookies.set('token', response.data.token, { expires: 7 }); // expires in 7 days
      Cookies.set('role', response.data.role, { expires: 7 });

      setIsLoggedIn(true); // ✅ will now work since passed from App.jsx
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setMessage(`❌ Login Failed: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Login
        </button>

        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default Login;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const role = Cookies.get("role");
  const navigate = useNavigate(); // for redirect after logout

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate('/login'); // Redirect to login
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Online Judge</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/submit" className="hover:underline">Compiler</Link>
        {role === "admin" && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}
        <button onClick={handleLogout} className="hover:underline text-red-300">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

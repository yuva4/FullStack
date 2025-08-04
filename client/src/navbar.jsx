import React from 'react';
import Cookies from 'js-cookie';

const Navbar = ({ setPage }) => {
const role = Cookies.get("role");


  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");

    setPage("login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Online Judge</h1>
      <div className="space-x-4">
        <button onClick={() => setPage('dashboard')} className="hover:underline">Dashboard</button>
        <button onClick={() => setPage('register')} className="hover:underline">Register</button>
        <button onClick={() => setPage('login')} className="hover:underline">Login</button>
        {role === "admin" && (
          <button onClick={() => setPage('admin')} className="hover:underline">Admin</button>
        )}
        <button onClick={handleLogout} className="hover:underline text-red-300">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

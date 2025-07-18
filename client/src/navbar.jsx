import React from 'react';

const Navbar = ({ setPage }) => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Online Judge</h1>
      <div className="space-x-4">
        <button onClick={() => setPage('dashboard')} className="hover:underline">Dashboard</button>
        <button onClick={() => setPage('register')} className="hover:underline">Register</button>
        <button onClick={() => setPage('login')} className="hover:underline">Login</button>
        <button onClick={() => setPage('admin')} className="hover:underline">Admin</button> {/* NEW */}
      </div>
    </nav>
  );
};

export default Navbar;

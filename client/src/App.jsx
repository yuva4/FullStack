import React, { useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import AdminProblems from './AdminProblems';

function App() {
  const [page, setPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ added

  return (
    <div>
      <Navbar setPage={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'register' && <Register />}
      {page === 'login' && <Login setIsLoggedIn={setIsLoggedIn} />} {/* ✅ updated */}
      {page === 'admin' && <AdminProblems />}
    </div>
  );
}

export default App;

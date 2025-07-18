import React, { useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import AdminProblems from './AdminProblems';

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div>
      <Navbar setPage={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'register' && <Register />}
      {page === 'login' && <Login />}
      {page === 'admin' && <AdminProblems />}
    </div>
  );
}

export default App;

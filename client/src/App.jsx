import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import AdminProblems from './AdminProblems';
import SubmitPage from './SubmitPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar /> {/* Navbar stays at the top on all pages */}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin" element={<AdminProblems />} />
        <Route path="/submit" element={<SubmitPage />} />
      </Routes>
    </Router>
  );
}

export default App;

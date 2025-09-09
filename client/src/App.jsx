import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Login from "./Login";
import AdminProblems from "./AdminProblems";
import SubmitPage from "./SubmitPage";
import SubmissionPage from "./SubmissionPage";
import ProblemsPage from "./ProblemsPage"; // ✅ new page

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/problems" element={<ProblemsPage />} /> {/* ✅ new */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin" element={<AdminProblems />} />
        <Route path="/submit/:id" element={<SubmitPage />} />
        <Route path="/submissions" element={<SubmissionPage />} />
      </Routes>
    </Router>
  );
}

export default App;

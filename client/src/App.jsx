import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Login from "./Login";
import AdminProblems from "./AdminProblems";
import SubmitPage from "./SubmitPage";
import SubmissionPage from "./SubmissionPage";
import ProblemsPage from "./ProblemsPage"; // ✅ new page
import PrivateRoute from "./PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected routes */}
        <Route
          path="/problems"
          element={
            <PrivateRoute>
              <ProblemsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/submit/:id"
          element={
            <PrivateRoute>
              <SubmitPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <PrivateRoute>
              <SubmissionPage />
            </PrivateRoute>
          }
        />

        {/* Admin route (protect this too if you want) */}
        <Route path="/admin" element={<AdminProblems />} />
      </Routes>
    </Router>
  );
}

export default App;

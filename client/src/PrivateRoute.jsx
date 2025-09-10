import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  // Check for auth token in cookies or localStorage
  const token = Cookies.get("token") || localStorage.getItem("token");

  if (!token) {
    // 🚨 If not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in → show the protected page
  return children;
};

export default PrivateRoute;

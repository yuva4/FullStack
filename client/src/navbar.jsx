import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const role = Cookies.get("role");
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login");
  };

  return (
    <nav className="bg-[#1E2E4F] text-white px-8 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Website Title */}
        <h1 className="text-2xl font-extrabold text-[#8FB3E2] tracking-wide">
          Code Quest ⚔️
        </h1>

        {/* Links */}
        <ul className="flex space-x-6 font-medium">
          <li>
            <Link to="/" className="hover:text-[#8FB3E2] transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/problems" className="hover:text-[#8FB3E2] transition">
              Problems
            </Link>
          </li>
          <li>
            <Link to="/submissions" className="hover:text-[#8FB3E2] transition">
              Submission
            </Link>
          </li>
          {role === "admin" && (
            <li>
              <Link to="/admin" className="hover:text-[#8FB3E2] transition">
                Admin
              </Link>
            </li>
          )}
          {!token && (
            <>
              <li>
                <Link to="/login" className="hover:text-[#8FB3E2] transition">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-[#8FB3E2] transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
          {token && (
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

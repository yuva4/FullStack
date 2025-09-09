import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#192338] via-[#1E2E4F] to-[#31487A] text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center flex-grow px-6 py-16">
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#8FB3E2] mb-6 tracking-wide">
          Code Quest ⚔️
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl text-[#D9E1F1] leading-relaxed mb-10">
          Embark on your coding adventure! Solve algorithmic challenges, test
          your skills, and sharpen your mind with AI-powered feedback.
        </p>

        {/* Buttons in Horizontal Row */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
    to="/login"
    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition transform hover:scale-110 w-56 text-center shadow-lg"
  >
    🔑 Login
  </Link>
  <Link
    to="/register"
    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition transform hover:scale-110 w-56 text-center shadow-lg"
  >
    📝 Register
  </Link>
  <Link
    to="/problems"
    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition transform hover:scale-110 w-56 text-center shadow-lg"
  >
  🚀 Explore Problems
</Link>


        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-[#1E2E4F] py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-[#192338] p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#8FB3E2] mb-3">
              🏆 Coding Challenges
            </h2>
            <p className="text-[#D9E1F1]">
              Solve problems from easy to hard, sharpen your skills, and grow
              steadily.
            </p>
          </div>
          <div className="bg-[#192338] p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#8FB3E2] mb-3">
              💻 Online Compiler
            </h2>
            <p className="text-[#D9E1F1]">
              Compile and run your code directly in C++, Java, and Python with
              real-time results.
            </p>
          </div>
          <div className="bg-[#192338] p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#8FB3E2] mb-3">
              🤖 AI Feedback
            </h2>
            <p className="text-[#D9E1F1]">
              Get personalized AI-powered code reviews and improve your coding
              style instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#192338] py-6 text-center text-[#8FB3E2] text-sm">
        © {new Date().getFullYear()} Code Quest. Crafted with ⚡ passion for
        coding warriors.Built By Yuva
      </footer>
    </div>
  );
};

export default Dashboard;

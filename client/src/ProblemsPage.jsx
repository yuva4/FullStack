import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BACKEND_URL = "https://code-quest-r6vt.onrender.com";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/problems`)
      .then((res) => setProblems(res.data))
      .catch((err) => console.error(" Error fetching problems:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#192338] via-[#1E2E4F] to-[#31487A] text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#8FB3E2]">
          Problems
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="bg-[#1E2E4F] p-6 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition"
          >
            <div>
              <h2 className="text-xl font-semibold">{problem.title}</h2>
              <p className="text-sm text-[#D9E1F1]">{problem.difficulty}</p>
            </div>
            <Link
              to={`/submit/${problem._id}`}
              className="bg-[#8FB3E2] text-black px-4 py-2 rounded-lg hover:bg-[#D9E1F1] transition"
            >
              Solve
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const BACKEND_URL = "https://code-quest-r6vt.onrender.com"; // ✅ backend port

export default function SubmissionPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const token = localStorage.getItem("token"); // ✅ get token
        if (!token) {
          console.warn(" No token found, redirecting to login...");
          navigate("/login"); // ✅ send to login if not logged in
          return;
        }

        const res = await axios.get(`${BACKEND_URL}/api/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setSubmissions(res.data.submissions);
        } else {
          setError(res.data.error || "Failed to fetch submissions");
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Server error while fetching submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#192338] via-[#1E2E4F] to-[#31487A] flex items-center justify-center p-6">
      <div className="bg-[#D9E1F1]/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-5xl">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-6 text-center text-[#192338] drop-shadow">
           My Submissions
        </h1>

        {/* Loading / Error / Empty */}
        {loading ? (
          <p className="text-center text-[#192338]"> Loading submissions...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold"> {error}</p>
        ) : submissions.length === 0 ? (
          <p className="text-center text-[#192338]">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full shadow-lg rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-[#8FB3E2] to-[#D9E1F1] text-[#192338] font-semibold text-left">
                  <th className="p-3">Problem</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Verdict</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">AI Review</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr
                    key={sub._id}
                    className={`${
                      idx % 2 === 0 ? "bg-[#F3F6FB]" : "bg-[#E6ECF7]"
                    } hover:bg-[#d4def2] transition`}
                  >
                    <td className="p-3 font-medium text-[#192338]">
                      {sub.problemId?.title || "Unknown"}
                    </td>
                    <td className="p-3 text-[#1E2E4F]">{sub.language}</td>
                    <td
                      className={`p-3 font-bold ${
                        sub.verdict === "Accepted"
                          ? "text-green-600"
                          : sub.verdict === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {sub.verdict}
                    </td>
                    <td className="p-3 text-sm text-[#192338]">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 max-w-xs align-top text-[#192338]">
                      {sub.aiReview ? (
                        <div className="prose prose-sm max-w-none max-h-40 overflow-y-auto whitespace-pre-wrap bg-white/60 p-2 rounded-md shadow-inner">
                          <ReactMarkdown>{sub.aiReview}</ReactMarkdown>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

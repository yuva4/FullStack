import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const BACKEND_URL = "http://localhost:5000"; // centralize backend URL

const SubmitPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(
    `#include <iostream>\nusing namespace std;\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b;\n  return 0;\n}`
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [results, setResults] = useState(null);
  const [review, setReview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // ✅ Fetch problem details
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/problems/${id}`)
      .then((res) => setProblem(res.data))
      .catch((err) => console.error("⚠️ Error loading problem:", err));
  }, [id]);

  // ✅ Run
  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/run", {
        code,
        language,
        input: problem?.sampleInput || "",
      });
      setOutput(res.data.output || res.data.error || "⚠️ No output");
    } catch (err) {
      console.error("⚠️ Run error:", err);
      setOutput("Error running code.");
    }
    setLoading(false);
  };

  // ✅ Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setOutput("⚠️ You must be logged in to submit.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${BACKEND_URL}/api/judge/${id}`,
        { language, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(res.data.results || []);
      setOutput(`Verdict: ${res.data.verdict}`);
    } catch (err) {
      console.error("⚠️ Submit error:", err);
      setOutput(
        `Error submitting code: ${
          err.response?.data?.error || err.message || "Unknown error"
        }`
      );
    }
    setLoading(false);
  };

  // ✅ AI Review
  const handleReview = async () => {
    setReview("");
    setReviewLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai-review`, { code });
      setReview(res.data.review);
    } catch (err) {
      console.error("⚠️ AI review failed:", err);
      setReview("⚠️ Failed to fetch review");
    }
    setReviewLoading(false);
  };

  if (!problem) return <p className="text-center mt-10">Loading problem...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Problem section */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-white">
            {problem.title}
          </h1>
          <p className="mb-4 text-gray-300">{problem.description}</p>

          <h3 className="font-semibold text-cyan-400">Sample Input:</h3>
          <pre className="bg-[#0f172a] text-gray-100 p-2 rounded mb-2 border border-gray-600">
            {problem.sampleInput}
          </pre>

          <h3 className="font-semibold text-cyan-400">Sample Output:</h3>
          <pre className="bg-[#0f172a] text-gray-100 p-2 rounded mb-2 border border-gray-600">
            {problem.sampleOutput}
          </pre>
        </div>

        {/* ✅ Editor + Actions */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-700">
          <div className="mb-4">
            <select
              className="bg-[#0f172a] text-gray-100 p-2 rounded w-full border border-gray-600"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <textarea
            rows="14"
            className="w-full p-4 font-mono border rounded-lg text-gray-100 bg-[#0f172a] border-gray-600"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>

          {/* ✅ Buttons */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={handleRun}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition"
              disabled={loading}
            >
              {loading ? "Running..." : "▶️ Run"}
            </button>

            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "✅ Submit"}
            </button>

            <button
              onClick={handleReview}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition"
              disabled={reviewLoading}
            >
              {reviewLoading ? "🤖 Reviewing..." : "🤖 Get AI Review"}
            </button>
          </div>

          {/* ✅ Output */}
          {output && (
            <div className="mt-6 bg-[#0f172a] text-gray-100 p-4 rounded-lg border border-gray-700">
              <strong>Output:</strong>
              <pre className="mt-2">{output}</pre>
            </div>
          )}

          {/* ✅ Results */}
          {results && (
            <div className="mt-6 bg-[#0f172a] text-gray-100 p-4 rounded-lg border border-gray-700">
              <strong>Submission Results:</strong>
              <ul className="list-disc ml-6">
                {results.map((res, i) => (
                  <li key={i}>
                    Testcase {i + 1}: {res.passed ? "✅ Passed" : "❌ Failed"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ AI Review */}
          {(reviewLoading || review) && (
            <div className="mt-6 bg-[#0f172a] text-gray-100 p-4 rounded-lg border border-gray-700">
              <h2 className="font-bold text-lg mb-2">🤖 AI Review:</h2>
              {reviewLoading ? (
                <p className="text-gray-400 italic">Generating review...</p>
              ) : (
                <div className="prose prose-sm max-w-none text-gray-200">
                  <ReactMarkdown>{review}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;

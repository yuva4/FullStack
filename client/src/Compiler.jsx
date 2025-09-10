// client/src/pages/Compiler.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BACKEND_URL = "https://code-quest-r6vt.onrender.com"; // main backend (problems + submissions)
const JUDGE_URL = "https://compiler-uth7.onrender.com";      // ✅ Your compiler server

export default function Compiler() {
  const { problemId } = useParams(); // ✅ get problemId from URL
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(`#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b);
    return 0;
}`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch problem details from backend
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/problems/${problemId}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    }
    fetchProblem();
  }, [problemId]);

  // ✅ Run button
  const handleRun = async () => {
    if (!problem) {
      setOutput(" Problem not loaded");
      return;
    }

    setLoading(true);
    setOutput(" Running...");

    try {
      const res = await axios.post(`${JUDGE_URL}/run`, {
        language,
        code,
        testcases: problem.testcases, // get testcases from DB
      });

      if (res.data.success) {
        setOutput(
          res.data.results
            .map(
              (r, i) =>
                `Testcase ${i + 1}: ${r.passed ? " Passed" : " Failed"}\n` +
                `Input: ${r.input}\nExpected: ${r.expectedOutput}\nGot: ${
                  r.output || r.error
                }\n`
            )
            .join("\n")
        );
      } else {
        setOutput(" Error: " + res.data.error);
      }
    } catch (err) {
      setOutput(" Failed to connect: " + err.message);
    }

    setLoading(false);
  };

  // ✅ Submit button (save to DB)
const handleSubmit = async () => {
  if (!problem) {
    setOutput(" Problem not loaded");
    return;
  }

  setLoading(true);
  setOutput(" Submitting...");

  try {
    // 1️⃣ Run code first against testcases
    const runRes = await axios.post(`${JUDGE_URL}/run`, {
      language,
      code,
      testcases: problem.testcases,
    });

    if (!runRes.data.success) {
      setOutput(" Error: " + runRes.data.error);
      setLoading(false);
      return;
    }

    const results = runRes.data.results;

    // 2️⃣ Decide verdict
    const allPassed = results.every((r) => r.passed);
    const verdict = allPassed ? "Accepted" : "Wrong Answer";

    // 3️⃣ Save submission to backend
    const saveRes = await axios.post(`${BACKEND_URL}/api/submissions`, {
      problemId: problemId,
      code,
      language,
      verdict,
      results,
    });

    if (saveRes.data.success) {
      setOutput(" Submission saved!\nVerdict: " + verdict);
    } else {
      setOutput(" Error saving submission: " + saveRes.data.error);
    }
  } catch (err) {
    setOutput(" Failed: " + err.message);
  }

  setLoading(false);
};


  return (
    <div className="p-6 space-y-4">
      {problem ? (
        <>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <p className="text-gray-700">{problem.description}</p>
          <p className="text-sm text-gray-500">Difficulty: {problem.difficulty}</p>
        </>
      ) : (
        <p>Loading problem...</p>
      )}

      {/* Language Select */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>

      {/* Code Editor */}
      <textarea
        rows="10"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border rounded p-2 font-mono"
      />

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleRun}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Running..." : "Run"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Output */}
      <div className="border rounded p-3 bg-gray-100 font-mono whitespace-pre-wrap">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

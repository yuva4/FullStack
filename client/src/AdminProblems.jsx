import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    tags: "",
    sampleInput: "",
    sampleOutput: "",
    testcases: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblems(res.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      alert("❌ Failed to fetch problems. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let parsedTestcases = [];
    try {
      parsedTestcases = JSON.parse(formData.testcases || "[]");
      if (!Array.isArray(parsedTestcases)) throw new Error();
    } catch {
      alert("❌ Invalid JSON format in testcases. Please enter a valid JSON array.");
      return;
    }

    const problemData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      testcases: parsedTestcases
    };

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/problems/${editingId}`, problemData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Problem updated successfully.");
      } else {
        await axios.post(`${BACKEND_URL}/api/problems`, problemData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Problem added successfully.");
      }

      setFormData({
        title: "",
        description: "",
        difficulty: "",
        tags: "",
        sampleInput: "",
        sampleOutput: "",
        testcases: ""
      });
      setEditingId(null);
      fetchProblems();
    } catch (error) {
      console.error("Error submitting problem:", error);
      alert("❌ Failed to submit problem. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (problem) => {
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags.join(", "),
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      testcases: JSON.stringify(problem.testcases, null, 2)
    });
    setEditingId(problem._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        setLoading(true);
        await axios.delete(`${BACKEND_URL}/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Problem deleted successfully.");
        fetchProblems();
      } catch (error) {
        console.error("Error deleting problem:", error);
        alert("❌ Failed to delete problem. Check backend connection.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
        Admin Problem Management
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 mb-8 bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-gray-700"
      >
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full rounded"
          required
        />
        <input
          name="difficulty"
          placeholder="Difficulty (Easy, Medium, Hard)"
          value={formData.difficulty}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full rounded"
          required
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full rounded"
        />
        <input
          name="sampleInput"
          placeholder="Sample Input"
          value={formData.sampleInput}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full rounded"
        />
        <input
          name="sampleOutput"
          placeholder="Sample Output"
          value={formData.sampleOutput}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full rounded"
        />
        <textarea
          name="testcases"
          placeholder={`Testcases as JSON:\n[\n  {"input":"2 3", "output":"5"},\n  {"input":"10 20", "output":"30"}\n]`}
          value={formData.testcases}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 text-gray-100 p-2 w-full h-32 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-105 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {editingId ? "Update Problem" : "Add Problem"}
        </button>
      </form>

      {/* Problems List */}
      <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
        Problems List
      </h3>

      {loading && <p className="mb-2 text-gray-400">Loading...</p>}

      {problems.length === 0 ? (
        <p className="text-gray-400">No problems found.</p>
      ) : (
        problems.map((problem) => (
          <div
            key={problem._id}
            className="bg-[#1e293b] border border-gray-700 p-4 mb-3 rounded-xl shadow-md"
          >
            <h4 className="font-bold text-lg text-white">{problem.title}</h4>
            <p className="text-gray-300">{problem.description}</p>
            <p>
              <strong className="text-cyan-400">Difficulty:</strong>{" "}
              {problem.difficulty}
            </p>
            <p>
              <strong className="text-cyan-400">Tags:</strong>{" "}
              {problem.tags.join(", ")}
            </p>
            <p>
              <strong className="text-cyan-400">Sample Input:</strong>{" "}
              {problem.sampleInput}
            </p>
            <p>
              <strong className="text-cyan-400">Sample Output:</strong>{" "}
              {problem.sampleOutput}
            </p>
            <p>
              <strong className="text-cyan-400">Testcases:</strong>{" "}
              {JSON.stringify(problem.testcases)}
            </p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleEdit(problem)}
                className="bg-yellow-500 text-black font-semibold px-3 py-1 rounded hover:bg-yellow-600"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(problem._id)}
                className="bg-red-600 text-white font-semibold px-3 py-1 rounded hover:bg-red-700"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminProblems;

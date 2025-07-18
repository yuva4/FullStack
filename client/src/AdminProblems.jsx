import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch all problems
  const fetchProblems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/problems");
      setProblems(res.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update a problem
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse testcases
    let parsedTestcases = [];
    try {
      parsedTestcases = JSON.parse(formData.testcases || "[]");
    } catch (error) {
      alert("❌ Invalid JSON format in testcases. Please enter a valid JSON array.");
      return;
    }

    const problemData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      testcases: parsedTestcases
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/problems/${editingId}`, problemData);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/problems", problemData);
      }

      // Reset form and refresh problems
      setFormData({
        title: "",
        description: "",
        difficulty: "",
        tags: "",
        sampleInput: "",
        sampleOutput: "",
        testcases: ""
      });

      fetchProblems();
    } catch (error) {
      console.error("Error submitting problem:", error);
      alert("❌ Failed to submit problem.");
    }
  };

  // Load a problem into the form for editing
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

  // Delete a problem
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await axios.delete(`http://localhost:5000/api/problems/${id}`);
        fetchProblems();
      } catch (error) {
        console.error("Error deleting problem:", error);
        alert("❌ Failed to delete problem.");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Problem Management</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-white p-4 rounded shadow-md">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="difficulty"
          placeholder="Difficulty (Easy, Medium, Hard)"
          value={formData.difficulty}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="sampleInput"
          placeholder="Sample Input"
          value={formData.sampleInput}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="sampleOutput"
          placeholder="Sample Output"
          value={formData.sampleOutput}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="testcases"
          placeholder={`Testcases as JSON:\n[\n  {"input":"2 3", "output":"5"},\n  {"input":"10 20", "output":"30"}\n]`}
          value={formData.testcases}
          onChange={handleChange}
          className="border p-2 w-full h-32"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {editingId ? "Update Problem" : "Add Problem"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Problems List</h3>

      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        problems.map(problem => (
          <div
            key={problem._id}
            className="border p-3 mb-2 bg-white rounded shadow-sm"
          >
            <h4 className="font-bold">{problem.title}</h4>
            <p>{problem.description}</p>
            <p><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p><strong>Tags:</strong> {problem.tags.join(", ")}</p>
            <p><strong>Sample Input:</strong> {problem.sampleInput}</p>
            <p><strong>Sample Output:</strong> {problem.sampleOutput}</p>
            <p><strong>Testcases:</strong> {JSON.stringify(problem.testcases)}</p>

            <div className="mt-2">
              <button
                onClick={() => handleEdit(problem)}
                className="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(problem._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminProblems;

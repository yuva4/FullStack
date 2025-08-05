import React, { useState } from 'react';
import axios from 'axios';

const SubmitPage = () => {
  const [code, setCode] = useState(`#include <iostream>\nint main() {\n  std::cout << "Hello Folks!!";\n  return 0;\n}`);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/run', { code });
      setOutput(res.data.output || res.data.error);
    } catch (err) {
      setOutput("Error running code.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">AlgoU Online Code Compiler</h1>

      <select className="mb-4 px-4 py-2 border rounded" disabled>
        <option>C++</option>
      </select>

      <textarea
        rows="10"
        className="w-full max-w-2xl p-4 font-mono border rounded shadow"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <button
        onClick={handleRun}
        className="mt-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 rounded shadow hover:scale-105 transition"
      >
        {loading ? 'Running...' : '▶️ Run'}
      </button>

      {output && (
        <div className="mt-6 bg-white w-full max-w-2xl p-4 rounded border text-blue-700">
          <strong>Output:</strong>
          <pre className="mt-2 bg-gray-100 p-2 rounded">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default SubmitPage;
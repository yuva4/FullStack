const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: { type: String, required: true },
    language: { type: String, default: "cpp" },
    verdict: { type: String, required: true }, // e.g., "Accepted", "Wrong Answer"
    results: { type: Array, default: [] },     // per-testcase results
    aiReview: { type: String, default: "" },   // ✅ NEW: AI feedback text
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);

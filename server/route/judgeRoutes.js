const express = require("express");
const axios = require("axios");
const Problem = require("../models/ProblemModel");
const Submission = require("../models/SubmissionModel");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

/**
 * POST /api/judge/:problemId
 * body: { code: string, language: string }
 * Runs code against all testcases, saves submission (with AI review), and returns results.
 */
router.post("/:problemId", isAuth, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language = "cpp" } = req.body;

    // 1. Fetch problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (!Array.isArray(problem.testcases) || problem.testcases.length === 0) {
      return res
        .status(400)
        .json({ error: "No testcases available for this problem" });
    }

    // 2. Run against all testcases
    let results = [];
    let passed = 0;

    for (const [index, tc] of problem.testcases.entries()) {
      try {
        const runRes = await axios.post(
          "http://localhost:8000/run",
          { code, language, input: tc.input },
          { timeout: 15000 } // 15s timeout
        );

        const rawOut = (
          runRes.data.output ?? runRes.data.error ?? ""
        ).toString();

        const normalize = (s) => (s ? s.replace(/\r/g, "").trim() : "");
        const got = normalize(rawOut);
        const expected = normalize(tc.output);

        const ok = got === expected;
        if (ok) passed++;

        results.push({
          testcase: index + 1,
          input: tc.input,
          expected,
          got,
          passed: ok,
        });
      } catch (err) {
        results.push({
          testcase: index + 1,
          input: tc.input,
          expected: tc.output || "",
          got: "RUNTIME/COMPILATION ERROR",
          passed: false,
        });
      }
    }

    // 3. Final verdict
    const verdict =
      passed === problem.testcases.length ? "✅ Accepted" : "❌ Wrong Answer";

    // 4. Call AI review service
    let aiReview = "";
    try {
      const aiRes = await axios.post("http://localhost:5000/api/ai-review", {
        code,
      });
      aiReview = aiRes.data.review;
    } catch (err) {
      console.error("⚠️ AI review failed:", err.message);
      aiReview = "⚠️ AI review unavailable at the moment.";
    }

    // 5. Save submission to DB
    const submission = await Submission.create({
      problemId,
      userId: req.user.id,
      code,
      language,
      verdict,
      results,
      aiReview, // ✅ store AI review
    });

    // 6. Return response
    return res.json({
      problemId,
      total: problem.testcases.length,
      passed,
      verdict,
      results,
      submissionId: submission._id,
      aiReview, // ✅ send back to client too
    });
  } catch (err) {
    console.error("❌ Judge route error:", err);
    return res.status(500).json({
      error: "Judge failed",
      details: err.message,
    });
  }
});

/**
 * GET /api/judge/submissions
 * Returns all submissions (with problem title populated)
 */
router.get("/submissions", isAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate("problemId", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("❌ Fetch submissions error:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

module.exports = router;

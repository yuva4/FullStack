const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const Submission = require("../models/SubmissionModel");

// ✅ Create a new submission
router.post("/", isAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({
        success: false,
        error: "⚠️ problemId and code are required",
      });
    }

    const newSubmission = new Submission({
      problemId,
      code,
      language,
      verdict: "Pending",
      results: [],
      userId: req.user.id, // ✅ store the logged-in user's ID
    });

    await newSubmission.save();

    return res.json({ success: true, submission: newSubmission });
  } catch (err) {
    console.error("Error saving submission:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error while saving submission" });
  }
});

// ✅ Get only the logged-in user's submissions
router.get("/", isAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("problemId");

    return res.json({ success: true, submissions });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error while fetching submissions" });
  }
});

module.exports = router;

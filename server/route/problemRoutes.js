const express = require("express");
const router = express.Router();
const Problem = require("../models/problemModel");
const isAdmin = require("../middleware/isAdmin");

// ✅ CREATE (Admin only)
router.post("/", isAdmin, async (req, res) => {
    try {
        const newProblem = new Problem(req.body);
        await newProblem.save();
        res.status(201).json(newProblem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  READ ALL (Public)
router.get("/", async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ READ ONE (Public)
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ UPDATE (Admin only)
router.put("/:id", isAdmin, async (req, res) => {
    try {
        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProblem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ DELETE (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        await Problem.findByIdAndDelete(req.params.id);
        res.json({ message: "Problem deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

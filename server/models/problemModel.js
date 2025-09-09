const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true } // ✅ match frontend
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [String],
    sampleInput: String,
    sampleOutput: String,
    testcases: [testcaseSchema]
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Problem || mongoose.model("Problem", problemSchema);

const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [String],
    sampleInput: String,
    sampleOutput: String,
    testcases: [
        {
            input: String,
            output: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);

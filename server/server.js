require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const aiRoutes = require("./route/aiRoutes");  // ✅ FIXED (was import)
app.use("/api/ai-review", aiRoutes);

const authRoutes = require("./route/auth");
app.use("/api/auth", authRoutes);

const problemRoutes = require("./route/problemRoutes");
app.use("/api/problems", problemRoutes);

const judgeRoutes = require("./route/judgeRoutes");
app.use("/api/judge", judgeRoutes);

const submissionRoutes = require("./route/submissionRoutes");
app.use("/api/submissions", submissionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

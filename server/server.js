require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./route/auth");
app.use("/api/auth", authRoutes);
const problemRoutes = require("./route/problemRoutes");
app.use("/api/problems", problemRoutes);




mongoose.connect(process.env.MONGO_URI)

.then(() => console.log(" MongoDB Atlas Connected"))
.catch(err => console.log(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


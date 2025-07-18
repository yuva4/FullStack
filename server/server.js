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



mongoose.connect("mongodb+srv://adminuser:JItL9d9gkFYCvJEo@cluster0.8f2ivxb.mongodb.net/onlinejudge?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log(" MongoDB Atlas Connected"))
.catch(err => console.log(err));


app.listen(5000, () => {
    console.log("Server running on port 5000");
});

// compiler server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const executeCode = require("./executeCode");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({ success: true, message: " Compiler server is alive!" });
});

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({
      success: false,
      error: " Language and code are required",
    });
  }

  try {
    const output = await executeCode(language, code, input || "");
    return res.json({ success: true, output });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.toString() });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(` Compiler server running at http://localhost:${PORT}`);
});

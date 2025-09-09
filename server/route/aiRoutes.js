const express = require("express");
const axios = require("axios");

const router = express.Router();

async function callGemini(code, retries = 3) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";  // Updated model
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [
                { text: `Review the following C++ code and give suggestions:\n\n${code}` },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GOOGLE_API_KEY,
          },
        }
      );

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No review returned";

    } catch (error) {
      if (error.response?.status === 503 && i < retries - 1) {
        console.warn(`⚠️ Gemini overloaded. Retrying... (${i + 1}/${retries})`);
        await new Promise(res => setTimeout(res, 2000)); // retry delay
      } else {
        throw error;
      }
    }
  }
}

router.post("/", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const aiText = await callGemini(code);
    res.json({ review: aiText });
  } catch (error) {
    console.error("AI review error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch AI review",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;

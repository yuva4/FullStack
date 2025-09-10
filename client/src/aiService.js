// client/src/services/aiService.js
import axios from "axios";

// Use deployed backend server
const SERVER_URL = "https://code-quest-r6vt.onrender.com";

export const getAIReview = async (code) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/ai-review`, { code });
    return response.data;
  } catch (error) {
    console.error("AI Review error:", error);
    throw error;
  }
};

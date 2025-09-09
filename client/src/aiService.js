// client/src/services/aiService.js
import axios from "axios";

export const getAIReview = async (code) => {
  try {
    const response = await axios.post("http://localhost:5000/api/ai-review", { code });
    return response.data;
  } catch (error) {
    console.error("AI Review error:", error);
    throw error;
  }
};

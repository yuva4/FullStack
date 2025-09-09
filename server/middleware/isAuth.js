const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, error: "⚠️ No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ make sure JWT_SECRET is in .env
    req.user = decoded; // decoded contains user id and other info from login

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, error: "⚠️ Invalid or expired token" });
  }
};

module.exports = isAuth;

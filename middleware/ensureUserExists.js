const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  const userId =
    (req.user && req.user.id) || req.body.user_id || req.params.userId;

  const authHeader = req.header("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "") || null;
  console.log("Authorization token:", token);
  console.log("req.user (decoded token):", req.user || null);
  console.log("req.user:", req.user);

  if (!userId) return res.status(400).json({ message: "user_id is required" });

  try {
    const user = await User.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.resolvedUserId = userId;
    next();
  } catch (err) {
    next(err);
  }
};

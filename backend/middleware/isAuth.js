import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("🍪 Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ message: "Token not found in cookies" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 Decoded token:", decoded);

    // ✅ Fix here: use decoded.id instead of decoded.userId
    if (!decoded?.id) {
      console.log("❌ Invalid token payload:", decoded);
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ No user found for ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("✅ Authenticated user:", user.name);
    next();
  } catch (err) {
    console.error("❌ isAuth error:", err.message);
    return res.status(401).json({
      message: "Unauthorized access",
      error: err.message,
    });
  }
};

export default isAuth;

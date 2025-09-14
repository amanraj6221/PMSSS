// 📂 src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate and authorize users
 * @param {string} roleRequired - Optional role ("USER", "SAG", "FINANCE")
 */
const authMiddleware = (roleRequired) => {
  return (req, res, next) => {
    try {
      // ✅ Check authorization header
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Authorization header missing",
        });
      }

      // ✅ Extract token
      const token = authHeader.split(" ")[1]; // "Bearer <token>"
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization format",
        });
      }

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // ✅ Attach user to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      // ✅ Role check
      if (roleRequired && decoded.role !== roleRequired) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${roleRequired} role required`,
        });
      }

      next();
    } catch (err) {
      console.error("❌ Auth Middleware Error:", err.message);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: " + err.message,
      });
    }
  };
};

export default authMiddleware;

// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
export default function authMiddleware(req, res, next) {
  if (req.method === "OPTIONS") return next(); // allow preflight
  const auth = req.header("Authorization");
  if (!auth) return res.status(401).json({ msg: "No token, authorization denied" });
  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Token is not valid" });
  }
}
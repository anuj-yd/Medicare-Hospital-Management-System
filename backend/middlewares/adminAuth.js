import { getAuth } from "@clerk/express";

export default function adminAuth(req, res, next) {
  const userId = getAuth(req)?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const adminUserId = process.env.MAJOR_ADMIN_ID?.trim();
  if (!adminUserId) {
    return res.status(500).json({ success: false, message: "Admin authorization is not configured" });
  }

  if (userId !== adminUserId) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }

  req.adminUserId = userId;
  return next();
}

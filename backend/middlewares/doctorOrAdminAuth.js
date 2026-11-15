import { getAuth } from "@clerk/express";
import adminAuth from "./adminAuth.js";
import doctorAuth from "./doctorAuth.js";

export default function doctorOrAdminAuth(req, res, next) {
  if (getAuth(req)?.userId) {
    return adminAuth(req, res, next);
  }

  return doctorAuth(req, res, next);
}

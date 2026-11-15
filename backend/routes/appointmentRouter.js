// routes/appointmentRouter.js
import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import adminAuth from "../middlewares/adminAuth.js";
import doctorOrAdminAuth from "../middlewares/doctorOrAdminAuth.js";
import doctorAuth from "../middlewares/doctorAuth.js";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  confirmPayment,
  updateAppointment,
  cancelAppointment,
  getStats,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  
  getRegisteredUserCount,
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

/* =========================
   PUBLIC / FIXED ROUTES
   ========================= */

// list appointments
appointmentRouter.get("/", adminAuth, getAppointments);

// stripe confirm
appointmentRouter.get("/confirm", confirmPayment);

// stats
appointmentRouter.get("/stats/summary", adminAuth, getStats);

/* =========================
   AUTHENTICATED ROUTES
   ========================= */

// create appointment
appointmentRouter.post(
  "/",
  clerkMiddleware(),
  requireAuth(),
  createAppointment
);

// 🔥 IMPORTANT: /me MUST COME BEFORE /:id
appointmentRouter.get(
  "/me",
  clerkMiddleware(),
  requireAuth(),
  getAppointmentsByPatient
);
// appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.get(
  "/doctor/:doctorId",
  doctorAuth,
  getAppointmentsByDoctor
);

appointmentRouter.post("/:id/cancel", adminAuth, cancelAppointment);
appointmentRouter.get("/paitents/count", adminAuth, getRegisteredUserCount);
appointmentRouter.put("/:id", doctorOrAdminAuth, updateAppointment);


export default appointmentRouter;

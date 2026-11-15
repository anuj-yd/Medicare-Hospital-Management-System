import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

// ⭐ ADD CLERK MIDDLEWARE
import { clerkMiddleware } from "@clerk/express";
import appointmentRouter from './routes/appointmentRouter.js';
import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRoutes.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';

const app = express();
const port = process.env.PORT || 4000;

// ⭐ IMPORTANT: CORS CONFIGURATION FOR PRODUCTION & DEVELOPMENT
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server, mobile apps, or curl (no origin header)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/$/, "");

      // 1. Check exact match against configured origins
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // 2. Allow any localhost development port
      if (/^http:\/\/localhost:\d+$/.test(cleanOrigin)) {
        return callback(null, true);
      }

      // 3. Allow all Vercel deployment & preview domains
      try {
        const { hostname } = new URL(cleanOrigin);
        if (hostname.endsWith(".vercel.app")) {
          return callback(null, true);
        }
      } catch (err) {
        // invalid URL
      }

      console.warn(`[CORS Blocked] Origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // REQUIRED for Clerk cookies / session auth
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


// ⭐ Use Clerk middleware globally (does NOT protect routes)
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Database Connection
connectDB();

// Static uploads folder


// Routes (unchanged)
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

// Test route
app.get('/', (req, res) => {
    res.send('API Working ');
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});

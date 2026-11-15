# MEDICARE - Full-Stack Hospital Management System

A production-ready Hospital Management and Healthcare Scheduling platform built on the **MERN** stack (MongoDB, Express, React, Node.js), featuring **Clerk** authentication, **Cloudinary** media management, and **Stripe** payment processing.

The repository is structured into three specialized subsystems:
- **`backend`**: RESTful API server powered by Express, MongoDB/Mongoose, Clerk SDK, and Stripe.
- **`admin`**: Administrative portal for hospital managers to oversee doctors, hospital services, and appointment schedules.
- **`frontend`**: Comprehensive patient portal for browsing doctors and services, booking appointments, and checking out via Stripe, plus a dedicated **Doctor Portal** workspace (`/doctor-admin/*`).

---

## Architecture Overview

```
                      +-----------------------------+
                      |   Clerk Authentication      |
                      | (Patients & Hospital Admin) |
                      +--------------+--------------+
                                     |
+--------------------------+         |         +---------------------------+
|      Patient Client      |         |         |     Admin Dashboard       |
| (React 19 / Vite / Tailwind)       |         | (React 19 / Vite / Tailwind)
|    http://localhost:5173 |         |         |    http://localhost:5174  |
+------------+-------------+         |         +-------------+-------------+
             |                       |                       |
             +-----------------------+-----------------------+
                                     |
                                     v
                 +---------------------------------------+
                 |       Express.js REST API Server      |
                 |         http://localhost:4000         |
                 +----+---------------+--------------+---+
                      |               |              |
                      v               v              v
               +------------+   +------------+ +------------+
               |  MongoDB   |   | Cloudinary | |   Stripe   |
               | (Database) |   |  (Storage) | | (Payments) |
               +------------+   +------------+ +------------+
```

---

## Subsystems & Key Features

### 1. Patient Portal (`frontend`)
- **Doctor Directory**: Browse doctors by medical specialty (Cardiology, Dermatology, Pediatrics, Neurology, etc.) with real-time availability status.
- **Appointment Scheduling**: Interactive date and time slot selector with instant booking confirmation.
- **Hospital Clinical Services**: Explore hospital diagnostic and care services with detailed procedure information.
- **Stripe Payments**: Integrated checkout for online fee settlement with dedicated verification and callback handlers.
- **Appointment Management**: Track personal appointment status (Pending, Confirmed, Completed, Canceled) with payment receipts.
- **Clerk Authentication**: Seamless, secure sign-in and sign-up with user profile management.

### 2. Doctor Portal (`frontend/src/doctor`)
- **Dedicated Doctor Workspace**: Embedded portal accessible via `/doctor-admin/login`.
- **JWT & Bcrypt Security**: Independent doctor authentication flow with secure password hashing.
- **Doctor Dashboard**: KPI analytics tracking active patients, completed consultations, and earnings.
- **Appointment Schedule**: Review and update patient appointment statuses.
- **Profile & Availability Editor**: Manage consultation fees, bio, qualifications, and working hours schedule.

### 3. Hospital Admin Dashboard (`admin`)
- **Restricted Access**: Protected with Clerk authentication, verified against `MAJOR_ADMIN_ID`.
- **Doctor Management**: Add new doctors with Cloudinary image upload, edit details, toggle availability, or remove listings.
- **Hospital Services Management**: Create and configure clinical hospital services with pricing, slot capacity, and instructions.
- **Appointment Oversight**: Comprehensive view of all doctor and service appointments with status filters and summary metrics.

### 4. Backend REST API (`backend`)
- **Authentication Guards**: Dual-layered auth supporting Clerk session verification and custom JWT tokens.
- **Media Pipeline**: Multer storage paired with Cloudinary cloud uploads for doctor and service media.
- **Payment Processing**: Stripe checkout session creation, webhook/verification endpoints, and status reconciliation.
- **Database Optimization**: Mongoose schemas with compound indexes and full-text search indexing on doctor and service directories.

---

## Repository Structure

```
MEDICARE/
├── admin/                  # Admin Dashboard Application (Vite + React 19)
│   ├── public/             # Static logos and assets
│   ├── src/
│   │   ├── components/     # Management tables, modal forms, dashboard cards
│   │   ├── hooks/          # useAdminFetch custom API hook
│   │   ├── pages/          # Admin route views
│   │   ├── App.jsx         # Clerk-guarded route definitions
│   │   └── main.jsx        # Application bootstrap
│   ├── .env.example        # Admin environment template
│   └── vite.config.js
│
├── backend/                # REST API Server (Node.js + Express)
│   ├── config/             # MongoDB connection configuration
│   ├── controllers/        # Doctor, Appointment, and Service controllers
│   ├── middlewares/        # Clerk auth, Doctor JWT auth, and Multer upload
│   ├── models/             # Mongoose schemas (Doctor, Appointment, Service, ServiceAppointment)
│   ├── routes/             # Express API route modules
│   ├── scripts/            # Database migration utilities
│   ├── utils/              # Cloudinary media handler
│   ├── .env.example        # Backend environment template
│   └── index.js            # Express server entrypoint
│
├── frontend/               # Patient Client & Doctor Portal (Vite + React 19)
│   ├── public/             # Static logos
│   ├── src/
│   │   ├── assets/         # UI illustrations, category icons, doctor portraits
│   │   ├── components/     # Navigation, hero banners, carousels, testimonials
│   │   ├── doctor/         # Doctor Portal workspace (dashboard, schedule, profile)
│   │   ├── pages/          # Patient route views (Doctors, Services, Appointments)
│   │   ├── utils/          # Doctor auth token utilities
│   │   ├── App.jsx         # Client routing with Stripe callbacks
│   │   └── main.jsx        # Application bootstrap
│   ├── VerifyPaymetPage.jsx            # Stripe appointment verification
│   ├── VerifyServicePaymentPage.jsx     # Stripe service appointment verification
│   ├── .env.example        # Frontend environment template
│   └── vite.config.js
│
└── .gitignore              # Monorepo-level gitignore rules
```

---

## Environment Configuration

Configure each subsystem by copying `.env.example` to `.env`:

### Backend (`backend/.env`)
```ini
PORT=4000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
MAJOR_ADMIN_ID=your_clerk_admin_user_id
```

### Admin Portal (`admin/.env`)
```ini
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Patient Frontend (`frontend/.env`)
```ini
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000
```

---

## Getting Started

### 1. Start the Backend API
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:4000`.

### 2. Start the Admin Dashboard
```bash
cd admin
npm install
npm run dev
```
The admin portal runs on `http://localhost:5174` (or configured Vite port).

### 3. Start the Patient Frontend & Doctor Portal
```bash
cd frontend
npm install
npm run dev
```
The client portal runs on `http://localhost:5173`.

---

## API Endpoints Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | List all active doctors with schedule |
| `POST` | `/api/doctors/login` | Public | Authenticate doctor with email & password |
| `POST` | `/api/doctors` | Admin | Register new doctor with image upload |
| `PUT` | `/api/doctors/:id` | Doctor | Update doctor profile details |
| `POST` | `/api/appointments` | Patient | Book consultation with Stripe session |
| `GET` | `/api/appointments/me` | Patient | List appointments for authenticated patient |
| `GET` | `/api/appointments/doctor/:doctorId` | Doctor | List appointments for assigned doctor |
| `GET` | `/api/services` | Public | List available hospital clinical services |
| `POST` | `/api/services` | Admin | Create hospital service listing |
| `POST` | `/api/service-appointments` | Patient | Book clinical service appointment |

---

## License

This project is licensed under the ISC License.

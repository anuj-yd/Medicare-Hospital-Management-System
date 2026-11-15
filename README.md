# MEDICARE — Full-Stack Hospital Management System

[![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)](https://react.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Auth](https://img.shields.io/badge/Auth-Clerk%20%2B%20JWT-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![Payments](https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![Storage](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

> A modern, production-grade Healthcare and Hospital Management System featuring multi-role access control (Patients, Doctors, Administrators), intelligent appointment scheduling, hospital clinical services catalog, integrated Stripe payments, Cloudinary media pipeline, and dual-layer authentication.

---

## Table of Contents

- [1. System Architecture](#1-system-architecture)
- [2. User Flow Architecture](#2-user-flow-architecture)
  - [A. Patient User Flow (Discovery to Checkout)](#a-patient-user-flow-discovery-to-checkout)
  - [B. Doctor Portal Flow (Authentication to Schedule Management)](#b-doctor-portal-flow-authentication-to-schedule-management)
  - [C. Hospital Admin Flow (Access Control & Operations)](#c-hospital-admin-flow-access-control--operations)
  - [D. Stripe Payment Lifecycle (Sequence Diagram)](#d-stripe-payment-lifecycle-sequence-diagram)
- [3. Authentication & Security Architecture](#3-authentication--security-architecture)
- [4. Repository Structure](#4-repository-structure)
- [5. Environment Configuration](#5-environment-configuration)
- [6. Local Setup & Installation](#6-local-setup--installation)
- [7. Complete REST API Reference](#7-complete-rest-api-reference)
- [8. Production Deployment Guidelines](#8-production-deployment-guidelines)

---

## 1. System Architecture

The MEDICARE platform is structured into three decoupled subprojects sharing a centralized REST API backend:

```mermaid
flowchart TB
    subgraph Clients["Presentation Layer (Client Interfaces)"]
        direction LR
        PClient["Patient Web Application\n(frontend / Port 5173)\nReact 19 + Tailwind v4"]
        DPortal["Doctor Workspace Portal\n(frontend/src/doctor)\nJWT Protected"]
        AClient["Admin Dashboard\n(admin / Port 5174)\nClerk Role Guarded"]
    end

    subgraph AuthLayer["Identity & Access Management"]
        direction LR
        ClerkAuth["Clerk Identity Provider\n(Patients & Hospital Admin)"]
        DoctorAuth["Custom JWT & Bcrypt\n(Doctor Portal Login)"]
    end

    subgraph APILayer["Backend Application Server (Express.js / Port 4000)"]
        direction TB
        ServerRouter["Express API Router"]
        
        subgraph Middlewares["Security & Pipeline Middlewares"]
            M_Clerk["clerkMiddleware()"]
            M_Admin["adminAuth (MAJOR_ADMIN_ID)"]
            M_Doctor["doctorAuth (JWT Bearer)"]
            M_Multer["Multer (Disk Storage & MIME validation)"]
        end

        subgraph Controllers["Business Logic Controllers"]
            C_Doc["Doctor Controller"]
            C_App["Appointment Controller"]
            C_Ser["Service Controller"]
            C_SerApp["Service Appointment Controller"]
        end
    end

    subgraph Services["Cloud Infrastructure & Database"]
        direction LR
        MongoCluster[("MongoDB Database\nMongoose ODM")]
        CloudinaryCDN["Cloudinary CDN\nMedia Storage"]
        StripeGateway["Stripe Payments\nCheckout Sessions"]
    end

    PClient -->|HTTP / Clerk Session| ServerRouter
    DPortal -->|HTTP / Bearer Token| ServerRouter
    AClient -->|HTTP / Clerk Admin Session| ServerRouter

    PClient -.-> ClerkAuth
    AClient -.-> ClerkAuth
    DPortal -.-> DoctorAuth

    ServerRouter --> Middlewares
    Middlewares --> Controllers

    Controllers --> MongoCluster
    Controllers --> CloudinaryCDN
    Controllers --> StripeGateway
```

---

## 2. User Flow Architecture

### A. Patient User Flow (Discovery to Checkout)

```mermaid
flowchart TD
    Start([Patient Visits MEDICARE]) --> Browse[Browse Home / Doctors / Services]
    
    Browse --> Filter[Filter by Specialty or Department]
    Filter --> DoctorDetails[View Doctor Profile & Availability Slots]
    
    DoctorDetails --> SelectSlot[Select Consultation Date & Time Slot]
    SelectSlot --> CheckAuth{Is Patient Signed In?}
    
    CheckAuth -- No --> SignInModal[Sign In via Clerk Modal]
    SignInModal --> SelectSlot
    
    CheckAuth -- Yes --> ChoosePayment{Select Payment Method}
    
    ChoosePayment -- Cash Payment --> CreateCashBooking[POST /api/appointments\nmethod: Cash]
    CreateCashBooking --> BookingPending[Appointment Created\nStatus: Pending / Unpaid]
    BookingPending --> MyAppointments[Redirect to My Appointments Page]
    
    ChoosePayment -- Online Stripe --> CreateStripeBooking[POST /api/appointments\nmethod: Online]
    CreateStripeBooking --> StripeSession[Backend Creates Stripe Checkout Session]
    StripeSession --> StripeCheckout[Redirect to Stripe Hosted Checkout]
    
    StripeCheckout --> StripeAction{Payment Decision}
    
    StripeAction -- Success --> SuccessPage[Redirect to /appointment/success]
    SuccessPage --> VerifyAPI[GET /api/appointments/confirm]
    VerifyAPI --> UpdatePaid[Status: Confirmed / Payment: Paid]
    UpdatePaid --> MyAppointments
    
    StripeAction -- Cancel --> CancelPage[Redirect to /appointment/cancel]
    CancelPage --> RetainPending[Appointment Saved as Pending]
    RetainPending --> MyAppointments
```

---

### B. Doctor Portal Flow (Authentication to Schedule Management)

```mermaid
flowchart TD
    DStart([Doctor Visits /doctor-admin/login]) --> EnterCreds[Enter Email & Password]
    EnterCreds --> PostLogin[POST /api/doctors/login]
    
    PostLogin --> VerifyHash{Verify Bcrypt Hash}
    VerifyHash -- Invalid --> ShowError[Display Invalid Credentials Toast]
    ShowError --> EnterCreds
    
    VerifyHash -- Valid --> IssueJWT[Generate JWT Token with Doctor ID & Role]
    IssueJWT --> SaveToken[Store in localStorage: doctorToken_v1]
    SaveToken --> DocDashboard[Load Doctor Dashboard /doctor-admin/:id]
    
    DocDashboard --> DocActions{Doctor Workflows}
    
    DocActions --> ViewAnalytics[View Dashboard KPIs:\nTotal Appointments, Earnings, Patient Count]
    
    DocActions --> ManageAppointments[View Assigned Patient Appointments]
    ManageAppointments --> UpdateStatus[PUT /api/appointments/:id\nChange Status: Confirmed / Completed / Canceled]
    
    DocActions --> EditProfile[Edit Profile & Working Hours]
    EditProfile --> UpdateSlots[Modify Time Slots, Consultation Fee, Bio]
    UpdateSlots --> PutProfile[PUT /api/doctors/:id with Bearer Token]
    PutProfile --> RefreshProfile[Doctor Profile Synchronized]
```

---

### C. Hospital Admin Flow (Access Control & Operations)

```mermaid
flowchart TD
    AStart([Admin Visits Dashboard / Port 5174]) --> ClerkAuthPrompt[Sign in with Clerk]
    ClerkAuthPrompt --> VerifyAdmin{Clerk User ID == MAJOR_ADMIN_ID?}
    
    VerifyAdmin -- Unauthorized --> Deny[Access Denied: 403 Forbidden]
    VerifyAdmin -- Authorized --> AdminHub[Access Admin Control Center]
    
    AdminHub --> Operations{Administrative Operations}
    
    Operations --> OpDoc[Doctor Directory Management]
    OpDoc --> AddDoc[Add Doctor: Name, Specs, Slots, Fee + Upload Photo]
    AddDoc --> CloudinaryUpload[Multer processes file -> Upload to Cloudinary]
    CloudinaryUpload --> SaveDocDB[Save Doctor in MongoDB]
    OpDoc --> ToggleDoc[Toggle Doctor Availability: Available / Unavailable]
    OpDoc --> DeleteDoc[Delete Doctor & Purge Assets]
    
    Operations --> OpService[Hospital Clinical Services]
    OpService --> AddService[Create Care Service, Schedule Slots & Price]
    OpService --> ListService[Update or Delete Existing Clinical Services]
    
    Operations --> OpAppointments[Global Appointments Oversight]
    OpAppointments --> FilterApp[Filter by Status, Date, or Doctor]
    OpAppointments --> Reschedule[Reschedule or Cancel Bookings]
    OpAppointments --> StatsSummary[Review Hospital Revenue & Booking Metrics]
```

---

### D. Stripe Payment Lifecycle (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient (Browser)
    participant Front as Frontend (/doctors/:id)
    participant Back as Express API (/api/appointments)
    participant Stripe as Stripe API Engine
    participant DB as MongoDB Atlas

    Patient->>Front: Clicks "Book Appointment" (Online Payment)
    Front->>Back: POST /api/appointments { doctorId, date, time, fees, paymentMethod: "Online" }
    Note over Back: Authenticates Patient with Clerk (requireAuth)
    Back->>Stripe: stripe.checkout.sessions.create({ line_items, success_url, cancel_url })
    Stripe-->>Back: Returns { id: sessionId, url: checkoutUrl }
    Back->>DB: Save Appointment (status: "Pending", payment: { status: "Pending", sessionId })
    Back-->>Front: Returns { success: true, url: checkoutUrl }
    Front->>Patient: Redirects browser to Stripe Checkout

    alt Patient Completes Payment
        Patient->>Stripe: Enters card details & approves payment
        Stripe-->>Patient: Redirects to /appointment/success?session_id=...
        Patient->>Front: Loads VerifyPaymentPage.jsx
        Front->>Back: GET /api/appointments/confirm?session_id=...
        Back->>Stripe: stripe.checkout.sessions.retrieve(session_id)
        Stripe-->>Back: Returns payment_status: "paid"
        Back->>DB: Update Appointment (status: "Confirmed", payment.status: "Paid")
        Back-->>Front: Returns { success: true, message: "Payment verified" }
        Front-->>Patient: Displays Success Banner & updates booking status
    else Patient Cancels Payment
        Patient->>Stripe: Clicks "Cancel & return"
        Stripe-->>Patient: Redirects to /appointment/cancel?session_id=...
        Patient->>Front: Displays Payment Canceled notice (Booking remains pending)
    end
```

---

## 3. Authentication & Security Architecture

MEDICARE implements a multi-tier authorization matrix ensuring complete segregation of privileges:

| Role | Auth Mechanism | Token / Identifier | Scope & Protected Capabilities |
| :--- | :--- | :--- | :--- |
| **Patient** | Clerk Authentication | Clerk Session Token (`@clerk/react` / `@clerk/express`) | Browse doctors/services, book consultations, pay via Stripe, access personal appointment history (`/api/appointments/me`). |
| **Doctor** | Custom JWT + Bcrypt | Bearer Token (`doctorToken_v1` in `localStorage`) | Access `/doctor-admin/*`, view assigned patient consultations, update appointment statuses, edit fees, bio, and schedule slots. |
| **Hospital Admin** | Clerk Auth + Environment Guard | Clerk User ID matching `MAJOR_ADMIN_ID` | Full CRUD access to doctor listings, hospital services, clinic appointment analytics, and doctor availability overrides. |

### Security Measures Implemented
- **CORS Protection**: Whitelisted origin validation restricting requests exclusively to `http://localhost:5173` (patient/doctor client) and `http://localhost:5174` (admin dashboard).
- **Environment Isolation**: Zero hardcoded secrets; sensitive credentials (`STRIPE_SECRET_KEY`, `CLERK_SECRET_KEY`, `CLOUDINARY_API_SECRET`, `MONGO_URI`) reside strictly in ignored `.env` files.
- **Password Salting**: Doctor passwords hashed with 12 bcrypt salt rounds before persistence; plaintext migration safeguarded with dry-run flags.
- **Upload Restrictions**: Multer file filter enforcing strict image MIME validation (`jpeg`, `jpg`, `png`, `webp`) and a 5 MB maximum size limit.

---

## 4. Repository Structure

```
MEDICARE/
├── .gitignore                          # Repository-level ignore rules (secrets, dist, node_modules)
├── README.md                           # Main architecture & developer documentation
│
├── admin/                              # Hospital Admin Dashboard (Vite + React 19)
│   ├── public/                         # Hospital branding and icons
│   ├── src/
│   │   ├── assets/                     # Admin CSS and animation styles
│   │   ├── components/
│   │   │   ├── AddPage/                # Add Doctor form with Cloudinary image upload
│   │   │   ├── AddService/             # Add Clinical Hospital Service form
│   │   │   ├── AppointmentsPage/       # Doctor Appointments management table
│   │   │   ├── DashboardPage/          # Doctor statistics & overview metrics
│   │   │   ├── Hero/                   # Admin landing hero component
│   │   │   ├── ListPage/               # Doctors list with real-time availability toggle
│   │   │   ├── ListServicePage/        # Hospital Services catalog manager
│   │   │   ├── Navbar/                 # Clerk user profile and navigation header
│   │   │   ├── ServiceAppointmentsPage/# Hospital Service bookings table
│   │   │   └── ServiceDashboard/       # Service appointments KPI dashboard
│   │   ├── hooks/
│   │   │   └── useAdminFetch.js        # Reusable authenticated Clerk fetch wrapper
│   │   ├── pages/                      # Routed page wrappers
│   │   ├── App.jsx                     # Route guard with Clerk RequireAuth
│   │   └── main.jsx                    # Admin React root entry
│   ├── .env.example                    # Admin environment variables template
│   ├── package.json                    # Admin dependencies (React 19, Tailwind v4, Clerk)
│   └── vite.config.js                  # Vite bundler configuration
│
├── backend/                            # REST API Engine (Express + MongoDB)
│   ├── config/
│   │   └── db.js                       # Mongoose database connection
│   ├── controllers/
│   │   ├── appointmentController.js    # Doctor appointments & Stripe integration
│   │   ├── doctorController.js         # Doctor CRUD, login & schedule parser
│   │   ├── serviceAppointmentController.js # Service booking & Stripe verification
│   │   └── serviceController.js        # Clinical hospital services CRUD
│   ├── middlewares/
│   │   ├── adminAuth.js                # Clerk admin authorization guard
│   │   ├── doctorAuth.js               # JWT bearer token verification for doctors
│   │   ├── doctorOrAdminAuth.js        # Dual-role access guard (Admin or Doctor)
│   │   └── multer.js                   # Disk storage & image validation middleware
│   ├── models/
│   │   ├── Appointment.js              # Doctor consultation booking schema
│   │   ├── Doctor.js                   # Doctor profile schema with text indexes
│   │   ├── Service.js                  # Clinical service package schema
│   │   └── serviceAppointment.js       # Hospital service booking schema
│   ├── routes/
│   │   ├── appointmentRouter.js        # /api/appointments endpoints
│   │   ├── doctorRouter.js             # /api/doctors endpoints
│   │   ├── serviceAppointmentRouter.js # /api/service-appointments endpoints
│   │   └── serviceRoutes.js            # /api/services endpoints
│   ├── scripts/
│   │   └── hashDoctorPasswords.js      # Password migration CLI utility
│   ├── utils/
│   │   └── cloudinary.js               # Cloudinary upload and destroy helpers
│   ├── .env.example                    # Backend environment variables template
│   ├── index.js                        # Express app initialization & middleware stack
│   └── package.json                    # Backend dependencies
│
└── frontend/                           # Patient Portal & Doctor Workspace (Vite + React 19)
    ├── public/                         # Public favicon and hospital branding
    ├── src/
    │   ├── assets/                     # Medical icons, banners, and doctor photography
    │   ├── components/
    │   │   ├── AppointmentPage/        # Patient booking history view
    │   │   ├── Banner/                 # Landing hero promotional banner
    │   │   ├── Certification/          # Healthcare accreditation badges
    │   │   ├── DoctorsPage/            # Doctor catalog with specialty filters
    │   │   ├── Footer/                 # Hospital contact links and legal footer
    │   │   ├── HomeDoctors/            # Featured doctors carousel
    │   │   ├── LoginPage/              # Doctor portal login form
    │   │   ├── Navbar/                 # Responsive navigation with Clerk Sign-In
    │   │   ├── ServicePage/            # Clinical hospital services showcase
    │   │   └── Testimonial/            # Verified patient reviews
    │   ├── data/
    │   │   └── doctorsData.js          # Fallback doctor dataset
    │   ├── doctor/                     # Embedded Doctor Workspace
    │   │   ├── DashboardPage/          # Doctor analytics overview
    │   │   ├── EditProfilePage/        # Doctor schedule and fee manager
    │   │   ├── ListPage/               # Patient appointment status editor
    │   │   └── Navbar/                 # Doctor workspace navigation header
    │   ├── pages/                      # Patient & Doctor route components
    │   ├── utils/
    │   │   └── doctorAuth.js           # JWT header generator for doctor requests
    │   ├── App.jsx                     # Client routing & scroll management
    │   └── main.jsx                    # Client React root entry
    ├── VerifyPaymetPage.jsx            # Stripe doctor appointment callback
    ├── VerifyServicePaymentPage.jsx     # Stripe service appointment callback
    ├── .env.example                    # Frontend environment variables template
    ├── package.json                    # Client dependencies (React 19, Tailwind v4, Stripe)
    └── vite.config.js                  # Vite bundler configuration
```

---

## 5. Environment Configuration

To configure your local environment, copy the template files in each folder:

### A. Backend (`backend/.env`)
```ini
# Application Port
PORT=4000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicare?retryWrites=true&w=majority

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MAJOR_ADMIN_ID=user_2... # The Clerk user ID of the primary administrator

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...

# Doctor Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Client URL
FRONTEND_URL=http://localhost:5173
```

### B. Admin Dashboard (`admin/.env`)
```ini
# Clerk Public Key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### C. Patient Frontend (`frontend/.env`)
```ini
# Clerk Public Key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend API Base URL
VITE_API_URL=http://localhost:4000
```

---

## 6. Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **MongoDB**: Local daemon or MongoDB Atlas cluster
- **Clerk Account**: For user management & authentication
- **Cloudinary Account**: For doctor and service image storage
- **Stripe Account**: For payment processing

### Step 1: Clone the Repository
```bash
git clone https://github.com/anuj-yd/Medicare-Hospital-Management-System.git
cd Medicare-Hospital-Management-System
```

### Step 2: Set up the Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```
*API runs at `http://localhost:4000`.*

### Step 3: Set up the Admin Dashboard
Open a new terminal window:
```bash
cd admin
npm install
cp .env.example .env
# Edit .env with your VITE_CLERK_PUBLISHABLE_KEY
npm run dev
```
*Admin Dashboard runs at `http://localhost:5174`.*

### Step 4: Set up the Patient Frontend & Doctor Portal
Open a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your VITE_CLERK_PUBLISHABLE_KEY and VITE_API_URL
npm run dev
```
*Patient Client runs at `http://localhost:5173`.*

---

## 7. Complete REST API Reference

### Doctor Endpoints (`/api/doctors`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | Retrieve all registered doctors with normalized schedules |
| `POST` | `/api/doctors/login` | Public | Authenticate doctor with email & password, returns JWT token |
| `GET` | `/api/doctors/:id` | Public | Retrieve detailed profile for an individual doctor |
| `POST` | `/api/doctors` | Admin (`adminAuth`) | Create a new doctor profile with Cloudinary image upload |
| `PUT` | `/api/doctors/:id` | Doctor (`doctorAuth`) | Update doctor profile details, fees, and schedule slots |
| `POST` | `/api/doctors/:id/toggle-availability` | Doctor (`doctorAuth`) | Toggle doctor status between Available and Unavailable |
| `DELETE` | `/api/doctors/:id` | Admin (`adminAuth`) | Remove doctor profile and destroy associated Cloudinary media |

### Doctor Appointment Endpoints (`/api/appointments`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Patient (`requireAuth`) | Create a new doctor appointment; returns Stripe checkout URL if Online |
| `GET` | `/api/appointments/me` | Patient (`requireAuth`) | Retrieve all appointments booked by the authenticated patient |
| `GET` | `/api/appointments/confirm` | Public | Verify Stripe checkout session payment status and confirm booking |
| `GET` | `/api/appointments/doctor/:doctorId` | Doctor (`doctorAuth`) | Retrieve all appointments booked with the requesting doctor |
| `PUT` | `/api/appointments/:id` | Doctor or Admin | Update appointment status (`Confirmed`, `Completed`, `Rescheduled`) |
| `POST` | `/api/appointments/:id/cancel` | Admin (`adminAuth`) | Cancel an appointment |
| `GET` | `/api/appointments` | Admin (`adminAuth`) | List all appointments across the entire hospital system |
| `GET` | `/api/appointments/stats/summary` | Admin (`adminAuth`) | Retrieve overall hospital appointment analytics and metrics |
| `GET` | `/api/appointments/paitents/count` | Admin (`adminAuth`) | Retrieve total count of distinct patients |

### Hospital Clinical Services (`/api/services`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | Retrieve catalog of all clinical hospital care services |
| `GET` | `/api/services/:id` | Public | Retrieve details, pricing, and slots for a specific service |
| `POST` | `/api/services` | Admin (`adminAuth`) | Create new clinical care service with Cloudinary image upload |
| `PUT` | `/api/services/:id` | Admin (`adminAuth`) | Update clinical service details, pricing, and available dates |
| `DELETE` | `/api/services/:id` | Admin (`adminAuth`) | Delete a hospital clinical service |

### Service Appointments (`/api/service-appointments`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/service-appointments` | Patient (`requireAuth`) | Book a clinical hospital service appointment |
| `GET` | `/api/service-appointments/me` | Patient (`requireAuth`) | Retrieve service appointments for the authenticated patient |
| `GET` | `/api/service-appointments/confirm` | Public | Verify Stripe checkout session for a service booking |
| `GET` | `/api/service-appointments` | Admin (`adminAuth`) | List all service bookings across the hospital |
| `GET` | `/api/service-appointments/stats/summary`| Admin (`adminAuth`) | Summary metrics on service bookings and revenue |
| `PUT` | `/api/service-appointments/:id` | Admin (`adminAuth`) | Reschedule or modify service booking status |
| `POST` | `/api/service-appointments/:id/cancel` | Admin (`adminAuth`) | Cancel a service appointment |

---

## 8. Production Deployment Guidelines

- **Frontend & Admin**: Build static assets with `npm run build` and deploy to platforms such as **Vercel**, **Netlify**, or **AWS S3/CloudFront**. Configure client-side SPA rewrite rules for `index.html`.
- **Backend**: Containerize using Docker or deploy to **Render**, **Railway**, **Fly.io**, or **AWS ECS/EC2**.
- **Database**: Use a managed **MongoDB Atlas** cluster with TLS encryption and IP access lists.
- **Stripe Webhooks**: For production payment processing, configure Stripe Webhook signing secrets for automated event reconciliation.

---

## License

This project is licensed under the [ISC License](LICENSE).

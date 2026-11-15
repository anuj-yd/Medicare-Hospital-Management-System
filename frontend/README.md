# MEDICARE - Patient Web App & Doctor Portal

The client-facing application of the MEDICARE Hospital Management System. Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Clerk**, and **Stripe**.

## Features

### Patient Application
- **Doctor Directory**: Search and filter doctors by medical department (Cardiology, Dermatology, Pediatrics, etc.).
- **Consultation Booking**: Select available appointment slots and confirm bookings.
- **Hospital Services**: Browse clinical services and book specialized procedures.
- **Online Checkout**: Integrated Stripe payments for immediate online booking fees.
- **My Appointments**: Real-time tracking of personal bookings and status changes.

### Doctor Portal (`/doctor-admin/*`)
- **Doctor Authentication**: Independent JWT-based login for medical staff.
- **Consultation Schedule**: Review upcoming appointments and update consultation statuses.
- **Profile Management**: Update professional qualifications, consultation fees, and weekly slot availability.

## Environment Setup

Create `.env` in this directory:

```ini
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000
```

## Running the Application

```bash
npm install
npm run dev
```
Runs by default on `http://localhost:5173`.

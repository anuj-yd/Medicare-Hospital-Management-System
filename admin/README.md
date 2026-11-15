# MEDICARE - Admin Portal

The administrative dashboard for the MEDICARE Hospital Management System. Built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Clerk** authentication.

## Features

- **Doctor Directory Management**: Add doctors with profile image upload (Cloudinary), edit details, toggle availability, and remove listings.
- **Hospital Clinical Services**: Create and update hospital clinical care packages, scheduling slots, and service fees.
- **Doctor Appointments**: Monitor and manage patient consultation bookings across all doctors with status tracking.
- **Service Appointments**: Review hospital service bookings, reschedule slots, and monitor payment status.
- **Clerk Authentication**: Restricts dashboard access to verified hospital administrators matching `MAJOR_ADMIN_ID`.

## Environment Setup

Create `.env` in this directory:

```ini
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Running the Application

```bash
npm install
npm run dev
```
Runs by default on `http://localhost:5174`.

# AmbuNear — Product Requirements Document & Constraints

## 1. Purpose & Problem
AmbuNear bridges the critical gap between emergency callers and nearby available ambulances. It streamlines discovering nearby ambulances, checking real-time availability, dispatching requests directly to drivers, and tracking the complete trip lifecycle.

## 2. Functional Requirements
- **FR-01: User Authentication & Profiles**
  - Registration with email, phone, name, password.
  - JWT session token generation, role verification (`PATIENT`, `DRIVER`, `ADMIN`).
- **FR-02: Ambulance Fleet Management**
  - Registration with vehicle number, ambulance type (Basic, ICU/Advanced, Patient Transport), equipment, driver association.
  - Verification lifecycle (`PENDING`, `VERIFIED`, `SUSPENDED`).
  - Real-time availability toggles (`AVAILABLE`, `BUSY`, `OFFLINE`).
- **FR-03: Geolocation & Distance Calculation**
  - Browser geolocation detection with fallback to manual address search.
  - MongoDB 2dsphere index for radius-based queries and server-side Haversine distance computations.
  - Development fallback map when map API keys are not supplied.
- **FR-04: Booking Dispatch & State Machine**
  - Atomic booking reservation to avoid double booking.
  - Driver notification of incoming emergency booking with Accept/Reject actions.
  - Valid transitions: `REQUESTED` ➔ `ACCEPTED` ➔ `ON_THE_WAY` ➔ `ARRIVED` ➔ `TRIP_STARTED` ➔ `COMPLETED`.
  - User cancellation support with reason tracking and automatic vehicle release.
- **FR-05: Driver Dashboard**
  - Availability toggle, vehicle details, incoming request notifications, active trip control panel, completed trip history.
- **FR-06: Admin Console**
  - Live system metrics (total users, active trips, fleet availability), user management, driver verification, ambulance fleet controls, audit logs.
- **FR-07: Public Information & Safety Pages**
  - Home, Find Ambulances, How It Works, Safety Information, FAQ, Contact, Privacy, Terms.
  - Configurable emergency contacts (108/112).

## 3. Non-Functional & Security Requirements
- **NFR-01: Application Security**: Passwords hashed with bcryptjs (salt rounds 10), Helmet security headers, CORS origin control, express-rate-limit on auth endpoints, NoSQL injection prevention.
- **NFR-02: Accessibility (WCAG 2.1 AA)**: Semantic landmarks, skip-to-content link, high contrast status badges, full keyboard navigability, screen-reader announcements for trip updates.
- **NFR-03: Reliability**: Atomic updates on booking creation and cancellation. No hardcoded mock statistics on dashboards.

# AmbuNear — System Architecture

## 1. System Overview

AmbuNear is a full-stack emergency ambulance booking and coordination platform designed for speed, clarity, reliability, and security during stressful medical situations.

```text
                    ┌─────────────────────────┐
                    │          USER           │
                    │   Patient / Attendant   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │  Vite + Router + Context│
                    └────────────┬────────────┘
                                 │
                           HTTP / REST API (JWT)
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Express.js Backend   │
                    │ Controllers, Middleware │
                    └───────┬─────────┬───────┘
                            │         │
                 ┌──────────┘         └──────────┐
                 ▼                               ▼
        ┌─────────────────┐             ┌─────────────────┐
        │     MongoDB     │             │ Location Engine │
        │  Mongoose Models│             │ Haversine / Maps│
        └─────────────────┘             └─────────────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Ambulance Driver  │
                  │  Dashboard Panel  │
                  └───────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component UI, fast modern bundler |
| **Routing** | React Router v6 | Client-side routing with role-protected route guards |
| **Icons & UI** | Lucide React, Custom CSS | Lightweight SVG icons, accessible design system |
| **State & Auth** | Context API | Global authentication state and theme management |
| **Backend** | Node.js, Express.js | Robust, modular REST API server |
| **Database** | MongoDB & Mongoose ODM | Document database with geospatial 2dsphere indexes |
| **Authentication**| JWT (JSON Web Tokens) & bcryptjs | Token-based stateless authentication with password hashing |
| **Security** | Helmet, CORS, express-rate-limit | HTTP header hardening, origin validation, rate limiting |
| **Validation** | express-validator | Strict input validation on all request bodies and queries |
| **Testing** | Vitest / Jest, Supertest, Postman | Automated backend test suite and API collections |

---

## 3. Data Models & Entity Relationships

```text
    ┌────────────────┐
    │      User      │
    │  (PATIENT,     │
    │   DRIVER,      │
    │   ADMIN)       │
    └───────┬────────┘
            │
            ├───────────────────────┐
            │ 1:1                   │ 1:N
            ▼                       ▼
    ┌────────────────┐      ┌────────────────┐
    │ DriverProfile  │      │    Booking     │
    │ (License, Loc, │◄────-┤ (User, Amb,    │
    │  Verification) │      │  Status, Locs) │
    └───────┬────────┘      └───────▲────────┘
            │ 1:N                   │
            ▼                       │
    ┌────────────────┐              │
    │   Ambulance    │──────────────┘
    │ (RegNo, Type,  │
    │  Coords, Stat) │
    └────────────────┘
```

---

## 4. Key Security & Architectural Decisions

1. **Role-Based Access Control (RBAC)**: All protected routes verify both token validity and user role (`PATIENT`, `DRIVER`, `ADMIN`). Privilege escalation during registration is blocked by rejecting unauthorized role assignments.
2. **Atomic Ambulance Reservation**: When creating or accepting a booking, status transitions use atomic conditional updates (`findOneAndUpdate({ _id, availability: 'AVAILABLE' })`) to prevent race conditions and double bookings.
3. **Strict Trip Progression State Machine**:
   `REQUESTED` ➔ `ACCEPTED` ➔ `ON_THE_WAY` ➔ `ARRIVED` ➔ `TRIP_STARTED` ➔ `COMPLETED` (or `CANCELLED` / `REJECTED`). Arbitrary transitions are rejected by backend validation.
4. **Resilient Geolocation Fallback**: Supports browser geolocation coordinates, manual street address search, and client-side Haversine distance calculations when third-party map tiles/APIs are unconfigured or unavailable.

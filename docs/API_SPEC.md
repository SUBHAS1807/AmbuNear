# AmbuNear — Complete REST API Specification

All endpoints communicate using JSON over HTTP. All response bodies adhere to the standard success and error response envelopes.

### Standard Response Envelopes
**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Human readable error explanation",
  "error": "ERROR_CODE",
  "errors": [] // Optional field-level validation errors
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | None | Public | Register new user or driver applicant |
| `POST` | `/api/auth/login` | None | Public | Authenticate user & return JWT token |
| `POST` | `/api/auth/logout` | Token | Any | Invalidate session / clear auth cookie |
| `GET` | `/api/auth/me` | Token | Any | Get current authenticated user profile |
| `PATCH`| `/api/auth/profile`| Token | Any | Update profile name, phone, etc. |

---

## 2. Ambulance Endpoints (`/api/ambulances`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/ambulances` | None | Public | List verified ambulances with pagination & filter |
| `GET` | `/api/ambulances/nearby` | None | Public | Find available ambulances near `latitude` & `longitude` |
| `GET` | `/api/ambulances/:id` | None | Public | Get single ambulance details |
| `POST` | `/api/ambulances` | Token | DRIVER, ADMIN | Register an ambulance vehicle |
| `PATCH`| `/api/ambulances/:id/status` | Token | DRIVER, ADMIN | Update availability (`AVAILABLE`, `BUSY`, `OFFLINE`) |

---

## 3. Booking & Trip Endpoints (`/api/bookings`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Token | PATIENT, ADMIN | Create new ambulance booking request |
| `GET` | `/api/bookings` | Token | Any | Get booking history for current user/driver |
| `GET` | `/api/bookings/:id` | Token | Owner / Driver / Admin | Get single booking details & live status |
| `PATCH`| `/api/bookings/:id/cancel` | Token | Owner, ADMIN | Cancel pending or accepted booking |
| `PATCH`| `/api/bookings/:id/accept` | Token | Assigned DRIVER | Driver accepts booking request |
| `PATCH`| `/api/bookings/:id/reject` | Token | Assigned DRIVER | Driver rejects request & releases ambulance |
| `PATCH`| `/api/bookings/:id/status` | Token | Assigned DRIVER | Advance trip status through valid state machine |

---

## 4. Driver Endpoints (`/api/driver`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/driver/dashboard` | Token | DRIVER | Get assigned ambulance, active trips & stats |
| `GET` | `/api/driver/bookings` | Token | DRIVER | Get driver incoming and past booking requests |
| `PATCH`| `/api/driver/availability`| Token | DRIVER | Toggle driver availability flag |
| `PATCH`| `/api/driver/location` | Token | DRIVER | Update driver's live GPS coordinates |

---

## 5. Administrative Endpoints (`/api/admin`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/metrics` | Token | ADMIN | Total users, drivers, active trips, fleet stats |
| `GET` | `/api/admin/users` | Token | ADMIN | Paginated list of registered users |
| `GET` | `/api/admin/drivers` | Token | ADMIN | List driver profiles with license status |
| `GET` | `/api/admin/ambulances` | Token | ADMIN | List all ambulances with verification status |
| `GET` | `/api/admin/bookings` | Token | ADMIN | All platform bookings with search & status filters |
| `PATCH`| `/api/admin/users/:id/status` | Token | ADMIN | Activate or suspend user account |
| `PATCH`| `/api/admin/drivers/:id/verification`| Token | ADMIN | Approve / reject driver verification |
| `PATCH`| `/api/admin/ambulances/:id/verification`| Token | ADMIN | Verify or disable ambulance vehicle |

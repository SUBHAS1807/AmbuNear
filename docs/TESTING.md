# AmbuNear — Testing & Quality Assurance Plan

This document describes the testing scenarios, verification strategy, and instructions for testing the AmbuNear platform.

---

## 1. Test Scenarios

### Authentication & Authorization
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| **AUTH-01** | Register new user with valid inputs | 201 Created with user info and auth token |
| **AUTH-02** | Register with duplicate email | 409 Conflict with `DUPLICATE_EMAIL` error code |
| **AUTH-03** | Register with invalid email/phone formatting | 400 Bad Request with field-level validation errors |
| **AUTH-04** | Login with correct email and password | 200 OK with token and user object |
| **AUTH-05** | Login with incorrect password | 401 Unauthorized with descriptive error |
| **AUTH-06** | Access protected route (`GET /api/auth/me`) without token | 401 Unauthorized |
| **AUTH-07** | Access driver route as normal user | 403 Forbidden |
| **AUTH-08** | Access admin route as driver or patient | 403 Forbidden |

### Ambulances & Geolocation
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| **AMB-01** | List all available ambulances | 200 OK with array of ambulances |
| **AMB-02** | Nearby search with valid lat/lng and radius | Returns only AVAILABLE verified ambulances within radius sorted by distance |
| **AMB-03** | Nearby search with missing coordinates | 400 Bad Request with validation message |
| **AMB-04** | Offline ambulance excluded from nearby search | Ambulances with status `OFFLINE` or `BUSY` are not returned in available search |
| **AMB-05** | Driver updates availability status (`AVAILABLE` / `BUSY` / `OFFLINE`) | Status persists and reflects immediately in search |
| **AMB-06** | Driver updates live location coordinates | Current location and `locationUpdatedAt` timestamp updated |

### Booking Lifecycle & Safety
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| **BK-01** | User books an available ambulance | 201 Created with status `REQUESTED` |
| **BK-02** | Booking an unavailable (`BUSY` / `OFFLINE`) ambulance | 400 Bad Request: ambulance not available |
| **BK-03** | Driver receives and accepts pending booking | Booking transitions to `ACCEPTED`; ambulance marked `BUSY` |
| **BK-04** | Driver rejects pending booking | Booking transitions to `REJECTED`; ambulance released |
| **BK-05** | Trip sequence validation (`ACCEPTED` -> `ON_THE_WAY` -> `ARRIVED` -> `TRIP_STARTED` -> `COMPLETED`) | Valid sequential transitions succeed; invalid transitions return 400 |
| **BK-06** | User cancels booking before completion | Status updated to `CANCELLED`; ambulance availability restored to `AVAILABLE` |
| **BK-07** | Concurrent booking safeguard | If two users attempt to book the same ambulance simultaneously, only one succeeds; the second receives `AMBULANCE_UNAVAILABLE` |

---

## 2. Automated & Manual Test Instructions

### Running Server Unit & Integration Tests
```bash
cd server
npm test
```

### Manual Testing with Postman
1. Import the Postman environment and collection from `server/tests/AmbuNear_Postman_Collection.json`.
2. Set the base URL variable to `http://localhost:5000/api`.
3. Run the Auth folder -> Register -> Login (token automatically stored in collection variable).
4. Run Ambulances -> Get Nearby Ambulances.
5. Run Bookings -> Create Booking Request -> Driver Accept -> Status Transitions -> Complete.

### Local Seeding for Testing
To populate the database with realistic test users, approved drivers, verified ambulances, and active demo bookings:
```bash
cd server
npm run seed
```
Demo accounts:
- **Admin**: `admin@ambunear.com` / `Admin@12345`
- **Driver 1**: `driver.suresh@ambunear.com` / `Driver@12345`
- **Driver 2**: `driver.rajesh@ambunear.com` / `Driver@12345`
- **Patient**: `patient.rahul@ambunear.com` / `Patient@12345`

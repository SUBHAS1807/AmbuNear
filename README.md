# AmbuNear 🚑

> **"Emergency Help, Closer to You."**
> A full-stack MERN ambulance discovery, booking, and trip coordination web application.

---
Web Link --> https://ambunear.onrender.com/

## 1. Introduction & Problem Statement

During sudden medical emergencies, patients and family members lose valuable minutes calling multiple ambulance operators, searching for vehicle availability, and trying to convey location directions over the phone.

**AmbuNear** solves this by offering a unified, transparent platform where users can:
1. Detect or enter their location.
2. Immediately view nearby available, verified ambulances on an interactive map.
3. Review ambulance types (Basic Life Support vs. Advanced ICU), equipment, and distance.
4. Book an ambulance with atomic reservation to avoid double booking.
5. Track trip progression in real-time as the driver responds.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide React, HTML5, CSS3 Custom Properties (Design System with Dark Mode).
- **State & Context**: React Context API for global authentication, theme persistence, and notifications.
- **Backend**: Node.js, Express.js REST API with modular controllers, routes, and middleware.
- **Database**: MongoDB with Mongoose ODM (geospatial 2dsphere indexing for location queries).
- **Security**: JWT stateless authentication, bcryptjs password hashing, Helmet HTTP headers, CORS origin isolation, and rate-limiting.
- **Testing**: Vitest/Node test runner and Postman Collection (`server/tests/AmbuNear_Postman_Collection.json`).

---

## 3. Project Structure

```text
ambunear/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   ├── SiteSearchModal.jsx
│   │   │   ├── CookieBanner.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── BackToTop.jsx
│   │   │   ├── ScrollProgressBar.jsx
│   │   │   ├── FloatingContact.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Ambulances.jsx
│   │   │   ├── AmbulanceDetails.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Safety.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Terms.jsx
│   │   │   ├── Privacy.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── clipboard.js
│   │   │   ├── formatters.js
│   │   │   └── utm.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ambulanceController.js
│   │   ├── bookingController.js
│   │   ├── driverController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Ambulance.js
│   │   ├── Booking.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ambulanceRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── driverRoutes.js
│   │   └── adminRoutes.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── ambulanceValidator.js
│   │   └── bookingValidator.js
│   ├── utils/
│   │   ├── geo.js
│   │   ├── seed.js
│   │   └── createAdmin.js
│   ├── tests/
│   │   ├── runAllTests.js
│   │   └── AmbuNear_Postman_Collection.json
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── REQUIREMENTS.md
│   ├── ROADMAP.md
│   └── TESTING.md
├── .gitignore
├── README.md
└── package.json
```

---

## 4. Database Models

- **User**: Name, phone, email, bcrypt password hash, role (`PATIENT`, `DRIVER`, `ADMIN`), account status (`ACTIVE`, `PENDING`, `SUSPENDED`).
- **Driver**: User reference, license number, license verification status (`PENDING`, `VERIFIED`, `REJECTED`), availability boolean, assigned ambulance reference, current coordinates, total trips completed.
- **Ambulance**: Vehicle registration number, ambulance category (`BASIC_LIFE_SUPPORT`, `ADVANCED_LIFE_SUPPORT`, `PATIENT_TRANSPORT`), availability (`AVAILABLE`, `BUSY`, `OFFLINE`), 2dsphere location coordinates, verified equipment checklist, base fare.
- **Booking**: User reference, ambulance reference, driver reference, unique tracking code (`AN-2026-XXXX`), pickup and destination coordinates/addresses, patient details, emergency notes, status machine timestamps.
- **AuditLog**: Admin user reference, action string, target entity, details, client IP, timestamp.

---

## 5. REST API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server health status, timestamp, and uptime |
| `POST` | `/api/auth/register` | Public | Register patient or driver applicant |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Private | Current user profile |
| `GET` | `/api/ambulances` | Public | List verified ambulances with filtering |
| `GET` | `/api/ambulances/nearby` | Public | Search available ambulances by latitude & longitude |
| `GET` | `/api/ambulances/:id` | Public | Single ambulance specifications |
| `POST` | `/api/ambulances` | Driver/Admin | Register ambulance vehicle |
| `PATCH` | `/api/ambulances/:id/status`| Driver/Admin | Update operational availability |
| `POST` | `/api/bookings` | Private | Create emergency booking with atomic vehicle lock |
| `GET` | `/api/bookings` | Private | User / driver booking history |
| `GET` | `/api/bookings/:id` | Private | Booking details and live status |
| `PATCH` | `/api/bookings/:id/cancel` | Private | Cancel active booking and release vehicle |
| `PATCH` | `/api/bookings/:id/accept` | Driver | Driver accepts pending dispatch |
| `PATCH` | `/api/bookings/:id/reject` | Driver | Driver declines pending dispatch |
| `PATCH` | `/api/bookings/:id/status` | Driver | Advance trip state sequentially |
| `GET` | `/api/driver/dashboard` | Driver | Driver dispatches, vehicle info, and stats |
| `PATCH` | `/api/driver/availability`| Driver | Toggle driver availability |
| `GET` | `/api/admin/metrics` | Admin | Real-time database metrics |
| `GET` | `/api/admin/users` | Admin | Paginated user management |
| `PATCH` | `/api/admin/users/:id/status`| Admin | Activate or suspend user accounts |
| `GET` | `/api/admin/drivers` | Admin | Review driver license submissions |
| `PATCH` | `/api/admin/drivers/:id/verification`| Admin | Verify or decline driver |
| `GET` | `/api/admin/ambulances` | Admin | Fleet management list |
| `PATCH` | `/api/admin/ambulances/:id/verification`| Admin | Verify or suspend ambulance vehicle |
| `GET` | `/api/admin/bookings` | Admin | View all bookings across the platform |
| `GET` | `/api/admin/audit-logs` | Admin | Administrative audit trail |

---

## 6. The 20 Website Enhancements Implemented

1. **Dark Mode Toggle**: CSS variables with automatic system theme detection and local storage persistence.
2. **Simple Cookie Banner**: Non-intrusive essential cookie and privacy notice with acceptance controls.
3. **Site Search**: Global search modal triggered via button or <kbd>Ctrl</kbd>+<kbd>K</kbd> / <kbd>Cmd</kbd>+<kbd>K</kbd> supporting keyboard navigation.
4. **Back to Top Button**: Floating button appearing upon scrolling down with smooth scroll.
5. **Mobile Navigation Drawer**: Responsive slide-out navigation with escape key listener and active states.
6. **Loading Animations**: Skeleton placeholders and submission spinners preventing duplicate submissions.
7. **Hover & Focus States**: Accessible `:focus-visible` rings and tactile touch feedback.
8. **Scroll Progress Bar**: Subtle gradient progress line tracking scroll position on long pages.
9. **Copy Button**: One-click clipboard copy for booking references with visual feedback and fallback.
10. **Print Stylesheet**: Dedicated `@media print` stylesheet for booking receipts and summaries hiding non-print elements.
11. **Sticky Header**: Sticky navigation bar with subtle elevation shadow on scroll.
12. **Skip to Content Link**: Accessible keyboard skip link targeting `#main-content`.
13. **Password Visibility Toggle**: Interactive eye icon toggle for password fields.
14. **UTM Parameter Tracking**: Captures and preserves `utm_source`, `utm_medium`, and `utm_campaign` privacy-consciously.
15. **Form Success State**: Detailed post-booking confirmation receipt displaying reference numbers and next steps.
16. **Form Error State**: Field-level validation messages and clear server error alerts.
17. **Confirmation Modals**: Accessible modal dialogs for booking cancellation and account suspension.
18. **Last Updated Timestamp**: Server-provided timestamps indicating data freshness.
19. **Expandable FAQ Accordion**: Keyboard-accessible accordion with ARIA attributes.
20. **Floating Emergency Button**: Unobtrusive floating emergency dialer with 108/112 quick access.

---

## 7. Local Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB (Local instance or MongoDB Atlas cluster connection string)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/SUBHAS1807/AmbuNear.git
cd AmbuNear

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server Configuration (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ambunear
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_here
CLIENT_URL=http://localhost:5173
```

**Client Configuration (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Seed Demonstration Data & Create Admin
```bash
# Seed realistic pilot demo data (users, drivers, ambulances, and sample trip)
cd server
npm run seed

# Or bootstrap a super administrator account
npm run create-admin
```

**Pre-seeded Demo Accounts (Password: `DemoPassword@123`):**
- **Admin**: `admin@ambunear.com`
- **Patient**: `patient@ambunear.com`
- **Driver 1 (Advanced ICU)**: `driver1@ambunear.com`
- **Driver 2 (Basic Life Support)**: `driver2@ambunear.com`

### 4. Run Development Servers
```bash
# Terminal 1 - Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (Port 5173)
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 8. Automated Testing

Run the comprehensive automated test suite testing geolocation algorithms, password hashing, JWT security, state machine transitions, and API response contracts:
```bash
cd server
npm test
```

For API manual verification, import `server/tests/AmbuNear_Postman_Collection.json` into Postman.

---

## 9. Production Deployment

### Backend on Render
1. Create a new Web Service on Render linked to your repository.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Configure Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend.vercel.app`.

### Frontend on Vercel
1. Import repository on Vercel.
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`.

---

## 10. Safety Disclaimer

AmbuNear is a technological booking and coordination platform. It is designed to assist in finding and scheduling ambulances in a pilot operating zone and **does not replace official national emergency medical services**. In life-threatening emergencies, dial **108** or **112** immediately.

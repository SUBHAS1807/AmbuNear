# AmbuNear --- Product Requirements Document (PRD)

## 1. Problem Statement

During medical emergencies, patients and their family members may spend
valuable time searching for an available ambulance. Information about
ambulance availability, location, driver response, and booking status
may not be available through one simple system.

AmbuNear is designed to provide a single platform where a person can
find nearby available ambulances and send a booking request to an
ambulance driver.

### Problem AmbuNear Addresses

-   Difficulty finding an available ambulance quickly
-   Lack of a simple nearby-ambulance discovery process
-   Unclear ambulance availability
-   Manual calling and coordination
-   Limited visibility into booking status

### Problem Validation

For the MVP, the problem will be validated through: - Short
surveys/interviews with students, families, and local residents -
Discussions with people who have previously arranged ambulance
services - Feedback from local ambulance operators/drivers - Observation
of how ambulance availability is currently communicated

The MVP should not assume that every ambulance service has the same
workflow; real user feedback will be used to refine the product.

------------------------------------------------------------------------

## 2. Target Users

### Primary User --- Patient / Patient Attendant

A person who needs to arrange an ambulance for a patient and wants to
quickly identify an available nearby ambulance.

Typical needs: - Find available ambulances - See basic ambulance
information - Send a booking request - Know whether the driver accepted
the request - Track the booking status

### Secondary User --- Ambulance Driver / Operator

An ambulance driver or operator who wants to receive and manage booking
requests digitally.

Typical needs: - Set ambulance availability - Receive nearby booking
requests - Accept or reject requests - View pickup information - Update
trip status

### Administrative User --- Admin

A platform administrator responsible for managing users, drivers,
ambulances, and bookings.

------------------------------------------------------------------------

## 3. Core Features for MVP

The MVP should contain only the smallest set of features needed to make
the core workflow useful.

### 3.1 User Authentication

-   User registration
-   User login
-   JWT-based authentication
-   Role-based access for patient, driver, and admin

### 3.2 Ambulance Registration

Drivers/admins can add ambulance information such as: - Vehicle number -
Ambulance type - Driver - Contact information - Current availability

### 3.3 Availability Management

Drivers can change ambulance status:

``` text
AVAILABLE
BUSY
OFFLINE
```

Only available ambulances should be offered for new bookings.

### 3.4 Nearby Ambulance Search

The user can provide/allow a location and see nearby available
ambulances.

The MVP should show: - Ambulance - Approximate distance - Availability -
Basic details - Booking option

### 3.5 Booking Request

A user can select an available ambulance and submit: - Pickup location -
Destination - Basic patient/contact information required for the booking

### 3.6 Driver Accept / Reject

The driver receives the request and can: - Accept - Reject

### 3.7 Booking Status

The MVP should support:

``` text
REQUESTED
ACCEPTED
ON_THE_WAY
ARRIVED
TRIP_STARTED
COMPLETED
CANCELLED
```

### 3.8 Booking History

Users can see previous bookings.

Drivers can see previous trips.

### 3.9 Basic Admin Dashboard

Admin can: - View users - View drivers - View ambulances - View
bookings - Manage platform records

------------------------------------------------------------------------

## 4. Core User Journey

``` text
User needs ambulance
        ↓
Open AmbuNear
        ↓
Login / Register
        ↓
Share or enter location
        ↓
View nearby available ambulances
        ↓
Select ambulance
        ↓
Enter pickup + destination
        ↓
Send booking request
        ↓
Driver receives request
        ↓
Driver accepts
        ↓
User sees confirmation
        ↓
Trip status updates
        ↓
Trip completed
```

------------------------------------------------------------------------

## 5. Out of Scope for MVP

The following features will NOT be built in the first version.

### 5.1 Online Payments

No payment gateway will be included initially.

**Why:** The first goal is to validate ambulance discovery and booking.

### 5.2 Advanced Live GPS Tracking

The MVP may use location/distance information, but continuous
high-frequency live GPS tracking is outside the initial scope.

**Why:** It adds significant real-time infrastructure and testing
complexity.

### 5.3 Hospital Integration

The first version will not directly integrate with hospital information
systems or hospital admission systems.

**Why:** Hospital integration requires external partnerships, APIs,
privacy considerations, and additional validation.

### 5.4 AI-Based Emergency Dispatch

The MVP will not automatically select or dispatch an ambulance using AI.

**Why:** The first version should validate the basic booking workflow
before introducing complex automation.

### 5.5 Automatic Emergency Calling

AmbuNear will not automatically call emergency services.

### 5.6 Medical Diagnosis

AmbuNear is not a medical diagnosis or treatment application.

### 5.7 Fleet-Level Enterprise Management

Large ambulance fleet optimization and enterprise billing are outside
the MVP.

### 5.8 Multi-City Optimization

The first version will focus on a limited pilot area rather than
attempting nationwide deployment.

------------------------------------------------------------------------

## 6. Success Metrics

Success should be measured through actual use of the MVP rather than
only technical completion.

### MVP User Goal

The initial target is to get at least **25 real test users** to try the
product during the validation period.

### Primary Metrics

#### 1. Successful Search Rate

Percentage of test users who can successfully find at least one
available ambulance.

Target: - Track during pilot - Identify failures and improve the search
flow

#### 2. Booking Completion Rate

Percentage of users who start a booking and successfully submit it.

Target: - Measure from booking start to submitted request

#### 3. Driver Response Rate

Percentage of booking requests that receive an accept/reject response.

Target: - Track response during pilot testing

#### 4. Successful End-to-End Test Trips

Number of test bookings that complete the full workflow:

``` text
Search
→ Book
→ Driver Accepts
→ Status Updates
→ Completed
```

#### 5. Repeat Usage / Intent

After using the MVP, ask users whether the product was useful and
whether they would use it again if they needed an ambulance.

#### 6. User Feedback

Collect structured feedback on: - Ease of finding an ambulance - Ease of
booking - Clarity of status - Driver interaction - Problems encountered

### MVP Value Signal

The MVP will be considered to provide useful evidence if test users can
repeatedly complete the core workflow and feedback indicates that the
system reduces the effort required to find and request an available
ambulance.

------------------------------------------------------------------------

## 7. Product Boundaries

AmbuNear is initially a **booking and coordination platform**.

It does not replace: - Emergency medical services - Ambulance operators'
legal responsibilities - Hospitals - Doctors - Government
emergency-response systems

The product should clearly communicate these boundaries to users.

------------------------------------------------------------------------

## 8. MVP Release Definition

The MVP is ready for pilot testing when:

-   User registration/login works
-   Driver registration works
-   Ambulance availability works
-   Nearby ambulance search works
-   Booking requests work
-   Driver accept/reject works
-   Booking status updates work
-   Booking history works
-   Basic admin management works
-   Core APIs are tested
-   The application is deployed to a test environment
-   At least 25 test users can access the application during the pilot

------------------------------------------------------------------------

## 9. Future Features

After validating the MVP, potential future additions include:

-   Live ambulance GPS tracking
-   Push notifications
-   SMS notifications
-   Online payments
-   Hospital discovery
-   Multiple ambulance types
-   Emergency priority handling
-   Driver ratings
-   Route/ETA calculation
-   Ambulance document verification
-   Multi-city support
-   Advanced analytics

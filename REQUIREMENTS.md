# AmbuNear --- Requirements

## 1. Functional Requirements

### FR-01 --- User Registration

The system must allow users to create an account using: - Name - Phone -
Email - Password

### FR-02 --- User Login

The system must authenticate registered users.

### FR-03 --- Ambulance Registration

Drivers/admins must be able to register an ambulance.

### FR-04 --- Ambulance Availability

Drivers must be able to change their status: - AVAILABLE - BUSY -
OFFLINE

### FR-05 --- Nearby Ambulance Search

The system must allow users to find available ambulances near their
location.

### FR-06 --- Ambulance Booking

A user must be able to request an available ambulance.

### FR-07 --- Driver Response

The driver must be able to ACCEPT or REJECT a booking request.

### FR-08 --- Booking Status

The system must maintain the current booking status.

### FR-09 --- Location

The system should support pickup and ambulance location information.

### FR-10 --- Booking History

Users should be able to see previous bookings.

### FR-11 --- Driver Dashboard

Drivers should be able to manage incoming requests and active trips.

### FR-12 --- Admin Dashboard

Administrators should be able to manage the platform.

## 2. Non-Functional Requirements

### Performance

API responses should normally be returned quickly under normal server
load.

### Security

The system should: - Hash passwords - Use JWT authentication - Protect
private APIs - Validate user input - Keep secrets in environment
variables

### Accessibility

The interface should be usable on: - Desktop - Tablet - Mobile

### Reliability

The system should prevent two users from successfully booking the same
ambulance when it is no longer available.

### Scalability

The backend should be structured so additional cities, ambulances and
users can be supported later.

## 3. Assumptions

For the first version: - Users have smartphones/internet access. -
Drivers have smartphones/internet access. - Location permission is
available. - Ambulance availability is updated by drivers. - The
application initially focuses on booking rather than payment processing.

## 4. Constraints

For the student/MVP version: - No complex AI initially - No online
payment initially - No hospital integration initially - No advanced live
GPS initially - No automatic emergency dispatch initially

These can be added later.

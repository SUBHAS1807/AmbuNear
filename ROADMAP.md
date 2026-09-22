# AmbuNear --- Development Roadmap

## Milestone 1 --- Project Foundation

**Target: Week 1**

-   React frontend
-   Express backend
-   MongoDB connection
-   Basic folder structure
-   Git repository
-   Environment variables

## Milestone 2 --- Authentication

**Target: Week 2**

-   User registration
-   Login
-   JWT authentication
-   Protected routes
-   Patient/Driver/Admin roles

## Milestone 3 --- Ambulance Management

**Target: Week 3**

-   Driver registration
-   Ambulance registration
-   Ambulance details
-   Available/Busy/Offline status
-   Driver dashboard

## Milestone 4 --- Booking System

**Target: Week 4**

``` text
Patient
   ↓
Search ambulance
   ↓
Select ambulance
   ↓
Book
   ↓
Driver receives request
   ↓
Accept / Reject
```

## Milestone 5 --- Location System

**Target: Week 5**

-   User location
-   Ambulance location
-   Nearby ambulance search
-   Distance calculation
-   Map display

## Milestone 6 --- Trip Tracking

**Target: Week 6**

``` text
REQUESTED
     ↓
ACCEPTED
     ↓
ON_THE_WAY
     ↓
ARRIVED
     ↓
TRIP_STARTED
     ↓
COMPLETED
```

## Milestone 7 --- Admin Panel

**Target: Week 7**

-   Manage users
-   Manage drivers
-   Manage ambulances
-   View bookings
-   Monitor active trips
-   Manage accounts

## Milestone 8 --- Deployment

**Target: Week 8**

``` text
React → Frontend hosting
Node/Express → Backend hosting
MongoDB → MongoDB Atlas
```

Then test the complete application.

## MVP Goal

The first working version should support:

``` text
Patient
   ↓
Find Nearby Ambulance
   ↓
Book
   ↓
Driver Dashboard
   ↓
Accept
   ↓
Patient sees confirmation
   ↓
Trip
   ↓
Completed
```

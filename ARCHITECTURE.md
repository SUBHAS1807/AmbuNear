# AmbuNear --- System Architecture

## 1. System Overview

AmbuNear is a web-based emergency ambulance booking platform that
connects patients with nearby available ambulances.

``` text
                    ┌─────────────────────┐
                    │       USER          │
                    │ Patient / Family    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   User Interface    │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │    MongoDB      │        │ Location/Maps   │
        │    Database     │        │     Service     │
        └─────────────────┘        └─────────────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Ambulance Driver  │
                  │     Dashboard     │
                  └───────────────────┘
```

## 2. Planned Technology Stack

  Layer             Technology             Why
  ----------------- ---------------------- ----------------------------
  Frontend          React.js               Component-based UI
  Backend           Node.js + Express.js   REST API development
  Database          MongoDB                Flexible document database
  ODM               Mongoose               MongoDB data modeling
  Authentication    JWT                    API authentication
  Maps              Google Maps / Mapbox   Location and distance
  API Testing       Postman                Backend testing
  Version Control   Git + GitHub           Source-code management
  Deployment        Render                 Simple deployment

## 3. Data Flow

``` text
User
 ↓
React Application
 ↓
POST /api/bookings
 ↓
Express Server
 ↓
Authentication
 ↓
Check Ambulance Availability
 ↓
MongoDB
 ↓
Create Booking
 ↓
Driver Dashboard
 ↓
Driver Accepts
 ↓
MongoDB Updated
 ↓
User receives updated booking status
```

## 4. Main Entities

### User

-   name
-   phone
-   email
-   role

### Driver

-   name
-   phone
-   availability

### Ambulance

-   vehicleNumber
-   type
-   location
-   status
-   driver

### Booking

-   user
-   ambulance
-   driver
-   pickupLocation
-   destination
-   status

## 5. Relationships

``` text
User
 │
 │ creates
 ▼
Booking
 │
 ├──────────► Ambulance
 │                 │
 │                 ▼
 │               Driver
 │
 └──────────► Hospital / Destination
```

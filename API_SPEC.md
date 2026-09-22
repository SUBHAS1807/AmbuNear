# AmbuNear --- API Specification

## 1. Authentication

  Method   Route                  Auth   Description
  -------- ---------------------- ------ ------------------
  POST     `/api/auth/register`   No     Register user
  POST     `/api/auth/login`      No     Login user
  GET      `/api/auth/me`         Yes    Get current user

## 2. Ambulance APIs

  Method   Route                          Auth           Description
  -------- ------------------------------ -------------- ------------------------
  GET      `/api/ambulances`              Yes            Get ambulances
  GET      `/api/ambulances/nearby`       Yes            Find nearby ambulances
  GET      `/api/ambulances/:id`          Yes            Get ambulance details
  POST     `/api/ambulances`              Driver/Admin   Add ambulance
  PATCH    `/api/ambulances/:id/status`   Driver         Change availability

## 3. Booking APIs

  Method   Route                        Auth     Description
  -------- ---------------------------- -------- ---------------------
  POST     `/api/bookings`              User     Create booking
  GET      `/api/bookings`              User     Get user's bookings
  GET      `/api/bookings/:id`          User     Get booking
  PATCH    `/api/bookings/:id/cancel`   User     Cancel booking
  PATCH    `/api/bookings/:id/accept`   Driver   Accept request
  PATCH    `/api/bookings/:id/status`   Driver   Update trip status

## 4. Driver APIs

  Method   Route                        Auth     Description
  -------- ---------------------------- -------- ---------------------
  GET      `/api/driver/bookings`       Driver   Get requests
  PATCH    `/api/driver/availability`   Driver   Change availability
  PATCH    `/api/driver/location`       Driver   Update location

## 5. Authentication Strategy

AmbuNear will use JWT authentication.

``` text
User
 ↓
Login
 ↓
Backend verifies credentials
 ↓
JWT generated
 ↓
Frontend stores token
 ↓
Token sent with protected requests
```

## 6. Standard Error Response

``` json
{
  "success": false,
  "message": "Ambulance is not available",
  "error": "AMBULANCE_UNAVAILABLE"
}
```

## 7. Standard Success Response

``` json
{
  "success": true,
  "message": "Ambulance booked successfully",
  "data": {}
}
```

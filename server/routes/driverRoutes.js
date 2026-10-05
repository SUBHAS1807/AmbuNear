const express = require('express');
const router = express.Router();
const {
  getDriverDashboard,
  getDriverBookings,
  updateAvailability,
  updateLocation,
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

// All driver routes require authentication and DRIVER or ADMIN role
router.use(protect);
router.use(authorize('DRIVER', 'ADMIN'));

router.get('/dashboard', getDriverDashboard);
router.get('/bookings', getDriverBookings);
router.patch('/availability', updateAvailability);
router.patch('/location', updateLocation);

module.exports = router;

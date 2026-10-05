const express = require('express');
const router = express.Router();
const {
  getMetrics,
  getUsers,
  updateUserStatus,
  getDrivers,
  verifyDriver,
  getAmbulances,
  verifyAmbulance,
  getBookings,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes strictly require authentication and ADMIN role
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/metrics', getMetrics);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/drivers', getDrivers);
router.patch('/drivers/:id/verification', verifyDriver);
router.get('/ambulances', getAmbulances);
router.patch('/ambulances/:id/verification', verifyAmbulance);
router.get('/bookings', getBookings);
router.get('/audit-logs', getAuditLogs);

module.exports = router;

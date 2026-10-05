const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  acceptBooking,
  rejectBooking,
  updateTripStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const {
  createBookingValidation,
  updateTripStatusValidation,
  cancelBookingValidation,
} = require('../validators/bookingValidator');

// All booking routes require authentication
router.use(protect);

router.post('/', createBookingValidation, createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBookingValidation, cancelBooking);

// Driver actions
router.patch('/:id/accept', authorize('DRIVER', 'ADMIN'), acceptBooking);
router.patch('/:id/reject', authorize('DRIVER', 'ADMIN'), rejectBooking);
router.patch(
  '/:id/status',
  authorize('DRIVER', 'ADMIN'),
  updateTripStatusValidation,
  updateTripStatus
);

module.exports = router;

const { body, param } = require('express-validator');
const { validate } = require('./authValidator');

const createBookingValidation = [
  body('ambulanceId')
    .notEmpty()
    .withMessage('Ambulance ID is required')
    .isMongoId()
    .withMessage('Invalid ambulance ID format'),
  body('pickupAddress')
    .trim()
    .notEmpty()
    .withMessage('Pickup address is required')
    .isLength({ min: 5, max: 300 })
    .withMessage('Pickup address must be between 5 and 300 characters'),
  body('pickupLatitude')
    .notEmpty()
    .withMessage('Pickup latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Pickup latitude must be a valid coordinate'),
  body('pickupLongitude')
    .notEmpty()
    .withMessage('Pickup longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Pickup longitude must be a valid coordinate'),
  body('destinationAddress')
    .trim()
    .notEmpty()
    .withMessage('Destination hospital or address is required')
    .isLength({ min: 3, max: 300 })
    .withMessage('Destination address must be between 3 and 300 characters'),
  body('destinationLatitude')
    .optional()
    .isFloat({ min: -90, max: 90 }),
  body('destinationLongitude')
    .optional()
    .isFloat({ min: -180, max: 180 }),
  body('patientName')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Patient name must be between 2 and 100 characters'),
  body('patientPhone')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact phone is required')
    .matches(/^[0-9+() -]{7,20}$/)
    .withMessage('Please provide a valid emergency contact phone number'),
  body('emergencyNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Emergency notes cannot exceed 500 characters'),
  validate,
];

const updateTripStatusValidation = [
  param('id').isMongoId().withMessage('Invalid booking ID format'),
  body('status')
    .notEmpty()
    .withMessage('New status is required')
    .isIn(['ON_THE_WAY', 'ARRIVED', 'TRIP_STARTED', 'COMPLETED'])
    .withMessage(
      'Status must be one of: ON_THE_WAY, ARRIVED, TRIP_STARTED, COMPLETED'
    ),
  validate,
];

const cancelBookingValidation = [
  param('id').isMongoId().withMessage('Invalid booking ID format'),
  body('cancellationReason')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Cancellation reason cannot exceed 300 characters'),
  validate,
];

module.exports = {
  createBookingValidation,
  updateTripStatusValidation,
  cancelBookingValidation,
};

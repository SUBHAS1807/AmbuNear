const { body, query, param } = require('express-validator');
const { validate } = require('./authValidator');

const createAmbulanceValidation = [
  body('vehicleNumber')
    .trim()
    .notEmpty()
    .withMessage('Vehicle registration number is required')
    .toUpperCase(),
  body('ambulanceType')
    .optional()
    .isIn(['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'PATIENT_TRANSPORT'])
    .withMessage('Invalid ambulance type specified'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('humanReadableAddress')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
  validate,
];

const nearbyAmbulanceValidation = [
  query('latitude')
    .notEmpty()
    .withMessage('Latitude parameter is required for nearby search')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .notEmpty()
    .withMessage('Longitude parameter is required for nearby search')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radiusKm')
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage('Search radius must be between 1 and 100 km'),
  validate,
];

const updateStatusValidation = [
  param('id').isMongoId().withMessage('Invalid ambulance ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['AVAILABLE', 'BUSY', 'OFFLINE'])
    .withMessage('Status must be AVAILABLE, BUSY, or OFFLINE'),
  validate,
];

module.exports = {
  createAmbulanceValidation,
  nearbyAmbulanceValidation,
  updateStatusValidation,
};

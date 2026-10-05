const express = require('express');
const router = express.Router();
const {
  getAmbulances,
  getNearbyAmbulances,
  getAmbulanceById,
  createAmbulance,
  updateAmbulanceStatus,
} = require('../controllers/ambulanceController');
const { protect, authorize } = require('../middleware/auth');
const {
  createAmbulanceValidation,
  nearbyAmbulanceValidation,
  updateStatusValidation,
} = require('../validators/ambulanceValidator');

// Public search endpoints
router.get('/', getAmbulances);
router.get('/nearby', nearbyAmbulanceValidation, getNearbyAmbulances);
router.get('/:id', getAmbulanceById);

// Protected endpoints
router.post(
  '/',
  protect,
  authorize('DRIVER', 'ADMIN'),
  createAmbulanceValidation,
  createAmbulance
);

router.patch(
  '/:id/status',
  protect,
  authorize('DRIVER', 'ADMIN'),
  updateStatusValidation,
  updateAmbulanceStatus
);

module.exports = router;

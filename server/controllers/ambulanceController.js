const Ambulance = require('../models/Ambulance');
const Driver = require('../models/Driver');
const { calculateHaversineDistanceKm, estimateEtaMinutes } = require('../utils/geo');

/**
 * @desc    Get all verified ambulances with optional filtering & pagination
 * @route   GET /api/ambulances
 * @access  Public
 */
const getAmbulances = async (req, res, next) => {
  try {
    const { ambulanceType, availability, page = 1, limit = 20 } = req.query;

    const query = { verificationStatus: 'VERIFIED' };
    if (ambulanceType) query.ambulanceType = ambulanceType;
    if (availability) query.availability = availability;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Ambulance.countDocuments(query);
    const ambulances = await Ambulance.find(query)
      .populate('driver', 'name phone')
      .skip(skip)
      .limit(parseInt(limit, 10))
      .sort({ availability: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Ambulances retrieved successfully',
      data: {
        ambulances,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / parseInt(limit, 10)) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search nearby available ambulances within a radius (km)
 * @route   GET /api/ambulances/nearby
 * @access  Public
 */
const getNearbyAmbulances = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.latitude);
    const lng = parseFloat(req.query.longitude);
    const radiusKm = parseFloat(req.query.radiusKm) || 25; // Default 25 km radius

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude coordinates are required.',
        error: 'INVALID_COORDINATES',
      });
    }

    // Query all verified & AVAILABLE ambulances
    const candidateAmbulances = await Ambulance.find({
      verificationStatus: 'VERIFIED',
      availability: 'AVAILABLE',
    }).populate('driver', 'name phone');

    // Calculate distance using Haversine formula and filter by radius
    const nearbyList = [];

    for (const amb of candidateAmbulances) {
      if (
        amb.location &&
        amb.location.coordinates &&
        amb.location.coordinates.length === 2
      ) {
        const ambLng = amb.location.coordinates[0];
        const ambLat = amb.location.coordinates[1];
        const distance = calculateHaversineDistanceKm(lat, lng, ambLat, ambLng);

        if (distance <= radiusKm) {
          const ambObj = amb.toObject();
          ambObj.distanceKm = distance;
          ambObj.estimatedEtaMinutes = estimateEtaMinutes(distance);
          nearbyList.push(ambObj);
        }
      }
    }

    // Sort by distance (closest first)
    nearbyList.sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({
      success: true,
      message: `Found ${nearbyList.length} available ambulances within ${radiusKm} km.`,
      data: {
        count: nearbyList.length,
        searchCoordinates: { latitude: lat, longitude: lng },
        radiusKm,
        ambulances: nearbyList,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single ambulance by ID
 * @route   GET /api/ambulances/:id
 * @access  Public
 */
const getAmbulanceById = async (req, res, next) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id).populate(
      'driver',
      'name phone email'
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found with the requested ID.',
        error: 'AMBULANCE_NOT_FOUND',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ambulance details retrieved successfully',
      data: { ambulance },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new ambulance
 * @route   POST /api/ambulances
 * @access  Private (DRIVER, ADMIN)
 */
const createAmbulance = async (req, res, next) => {
  try {
    const {
      vehicleNumber,
      ambulanceType,
      contactNumber,
      latitude,
      longitude,
      humanReadableAddress,
      equipment,
      baseFare,
    } = req.body;

    const existing = await Ambulance.findOne({
      vehicleNumber: vehicleNumber.toUpperCase(),
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An ambulance with this vehicle number is already registered.',
        error: 'DUPLICATE_VEHICLE_NUMBER',
      });
    }

    const assignedDriverId = req.user.role === 'DRIVER' ? req.user._id : req.body.driverId || null;

    const newAmbulance = await Ambulance.create({
      vehicleNumber: vehicleNumber.toUpperCase(),
      ambulanceType: ambulanceType || 'BASIC_LIFE_SUPPORT',
      driver: assignedDriverId,
      contactNumber,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      humanReadableAddress: humanReadableAddress || 'Pilot Operating Center',
      equipment: equipment || ['Oxygen Cylinder', 'First Aid Kit', 'Stretcher'],
      baseFare: baseFare || 500,
      verificationStatus: req.user.role === 'ADMIN' ? 'VERIFIED' : 'PENDING',
      availability: 'AVAILABLE',
    });

    // If driver created it, associate with driver profile
    if (req.user.role === 'DRIVER') {
      await Driver.findOneAndUpdate(
        { user: req.user._id },
        { assignedAmbulance: newAmbulance._id }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Ambulance registered successfully.',
      data: { ambulance: newAmbulance },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update ambulance operational status (AVAILABLE, BUSY, OFFLINE)
 * @route   PATCH /api/ambulances/:id/status
 * @access  Private (DRIVER, ADMIN)
 */
const updateAmbulanceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ambulance = await Ambulance.findById(req.params.id);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found.',
        error: 'AMBULANCE_NOT_FOUND',
      });
    }

    // Role check: if DRIVER, must be assigned to this ambulance
    if (
      req.user.role === 'DRIVER' &&
      ambulance.driver &&
      ambulance.driver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update another driver assigned ambulance.',
        error: 'FORBIDDEN_AMBULANCE_ACCESS',
      });
    }

    ambulance.availability = status;
    await ambulance.save();

    // Sync Driver availability if needed
    if (ambulance.driver) {
      await Driver.findOneAndUpdate(
        { user: ambulance.driver },
        { isAvailable: status === 'AVAILABLE' }
      );
    }

    res.status(200).json({
      success: true,
      message: `Ambulance status updated to ${status}.`,
      data: { ambulance },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAmbulances,
  getNearbyAmbulances,
  getAmbulanceById,
  createAmbulance,
  updateAmbulanceStatus,
};

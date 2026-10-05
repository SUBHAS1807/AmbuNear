const Driver = require('../models/Driver');
const Ambulance = require('../models/Ambulance');
const Booking = require('../models/Booking');

/**
 * @desc    Get complete Driver Dashboard data
 * @route   GET /api/driver/dashboard
 * @access  Private (DRIVER)
 */
const getDriverDashboard = async (req, res, next) => {
  try {
    let driverProfile = await Driver.findOne({ user: req.user._id }).populate(
      'assignedAmbulance'
    );

    if (!driverProfile) {
      // Auto-initialize profile if missing
      driverProfile = await Driver.create({
        user: req.user._id,
        licenseNumber: 'DOC-PENDING',
        licenseVerificationStatus: 'PENDING',
      });
    }

    // Find incoming pending request for this driver or this ambulance
    const assignedAmbulanceId = driverProfile.assignedAmbulance
      ? driverProfile.assignedAmbulance._id
      : null;

    const incomingRequests = await Booking.find({
      status: 'REQUESTED',
      ...(assignedAmbulanceId
        ? { ambulance: assignedAmbulanceId }
        : { driver: req.user._id }),
    })
      .populate('user', 'name phone')
      .populate('ambulance', 'vehicleNumber ambulanceType')
      .sort({ createdAt: -1 });

    // Find currently active trip
    const activeTrip = await Booking.findOne({
      driver: req.user._id,
      status: { $in: ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'TRIP_STARTED'] },
    })
      .populate('user', 'name phone email')
      .populate('ambulance', 'vehicleNumber ambulanceType contactNumber');

    // Recent completed trips
    const completedTrips = await Booking.find({
      driver: req.user._id,
      status: 'COMPLETED',
    })
      .populate('user', 'name phone')
      .populate('ambulance', 'vehicleNumber')
      .sort({ completedAt: -1 })
      .limit(10);

    const totalTrips = await Booking.countDocuments({
      driver: req.user._id,
      status: 'COMPLETED',
    });

    res.status(200).json({
      success: true,
      message: 'Driver dashboard data retrieved successfully',
      data: {
        driverProfile,
        incomingRequests,
        activeTrip,
        completedTrips,
        totalCompletedTrips: totalTrips,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings assigned to this driver
 * @route   GET /api/driver/bookings
 * @access  Private (DRIVER)
 */
const getDriverBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate('user', 'name phone email')
      .populate('ambulance', 'vehicleNumber ambulanceType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Driver bookings retrieved successfully',
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle driver operational availability
 * @route   PATCH /api/driver/availability
 * @access  Private (DRIVER)
 */
const updateAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { user: req.user._id },
      { isAvailable: Boolean(isAvailable) },
      { new: true }
    ).populate('assignedAmbulance');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found.',
        error: 'DRIVER_NOT_FOUND',
      });
    }

    // Sync assigned ambulance availability
    if (driver.assignedAmbulance) {
      await Ambulance.findByIdAndUpdate(driver.assignedAmbulance._id, {
        availability: isAvailable ? 'AVAILABLE' : 'OFFLINE',
      });
    }

    res.status(200).json({
      success: true,
      message: `Driver status updated to ${isAvailable ? 'AVAILABLE' : 'OFFLINE'}.`,
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update driver & assigned ambulance live GPS coordinates
 * @route   PATCH /api/driver/location
 * @access  Private (DRIVER)
 */
const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, humanReadableAddress } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude coordinates are required.',
        error: 'MISSING_COORDINATES',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const driver = await Driver.findOneAndUpdate(
      { user: req.user._id },
      {
        currentLocation: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        locationUpdatedAt: new Date(),
      },
      { new: true }
    );

    if (driver && driver.assignedAmbulance) {
      await Ambulance.findByIdAndUpdate(driver.assignedAmbulance, {
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        ...(humanReadableAddress && { humanReadableAddress }),
        locationUpdatedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully.',
      data: {
        coordinates: { latitude: lat, longitude: lng },
        locationUpdatedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDriverDashboard,
  getDriverBookings,
  updateAvailability,
  updateLocation,
};

const Booking = require('../models/Booking');
const Ambulance = require('../models/Ambulance');
const Driver = require('../models/Driver');
const { calculateHaversineDistanceKm } = require('../utils/geo');

/**
 * @desc    Create a new ambulance booking request
 * @route   POST /api/bookings
 * @access  Private (PATIENT, USER, ADMIN)
 */
const createBooking = async (req, res, next) => {
  try {
    const {
      ambulanceId,
      pickupAddress,
      pickupLatitude,
      pickupLongitude,
      destinationAddress,
      destinationLatitude,
      destinationLongitude,
      patientName,
      patientPhone,
      emergencyNotes,
    } = req.body;

    // Check if user already has an active pending/in-progress booking
    const activeBooking = await Booking.findOne({
      user: req.user._id,
      status: { $in: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'TRIP_STARTED'] },
    });

    if (activeBooking) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active emergency booking in progress.',
        error: 'ACTIVE_BOOKING_EXISTS',
        data: { activeBookingId: activeBooking._id, status: activeBooking.status },
      });
    }

    // Atomic reservation of ambulance: Only book if availability is currently 'AVAILABLE'
    const reservedAmbulance = await Ambulance.findOneAndUpdate(
      {
        _id: ambulanceId,
        availability: 'AVAILABLE',
        verificationStatus: 'VERIFIED',
      },
      { availability: 'BUSY' },
      { new: true }
    );

    if (!reservedAmbulance) {
      return res.status(400).json({
        success: false,
        message:
          'The selected ambulance is currently busy or unavailable. Please choose another ambulance.',
        error: 'AMBULANCE_UNAVAILABLE',
      });
    }

    // Calculate approximate distance from ambulance coordinates to pickup
    let distanceKm = 0;
    if (
      reservedAmbulance.location &&
      reservedAmbulance.location.coordinates &&
      reservedAmbulance.location.coordinates.length === 2
    ) {
      const ambLng = reservedAmbulance.location.coordinates[0];
      const ambLat = reservedAmbulance.location.coordinates[1];
      distanceKm = calculateHaversineDistanceKm(
        parseFloat(pickupLatitude),
        parseFloat(pickupLongitude),
        ambLat,
        ambLng
      );
    }

    // Create the booking document
    const newBooking = await Booking.create({
      user: req.user._id,
      ambulance: reservedAmbulance._id,
      driver: reservedAmbulance.driver || null,
      pickupAddress,
      pickupLocation: {
        type: 'Point',
        coordinates: [parseFloat(pickupLongitude), parseFloat(pickupLatitude)],
      },
      destinationAddress,
      destinationLocation: {
        type: 'Point',
        coordinates: [
          parseFloat(destinationLongitude || 77.21),
          parseFloat(destinationLatitude || 28.62),
        ],
      },
      patientName,
      patientPhone,
      emergencyNotes: emergencyNotes || '',
      status: 'REQUESTED',
      distanceKm,
      requestedAt: new Date(),
    });

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('ambulance', 'vehicleNumber ambulanceType contactNumber location availability')
      .populate('driver', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Ambulance booking request submitted successfully. Waiting for driver confirmation.',
      data: { booking: populatedBooking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's booking history
 * @route   GET /api/bookings
 * @access  Private
 */
const getBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (req.user.role === 'ADMIN') {
      // Admin sees all, or can filter
    } else if (req.user.role === 'DRIVER') {
      query.driver = req.user._id;
    } else {
      query.user = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('ambulance', 'vehicleNumber ambulanceType contactNumber location availability')
      .populate('driver', 'name phone')
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
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
 * @desc    Get single booking by ID with ownership check
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('ambulance', 'vehicleNumber ambulanceType contactNumber location humanReadableAddress availability')
      .populate('driver', 'name phone email')
      .populate('user', 'name phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found with the requested ID.',
        error: 'BOOKING_NOT_FOUND',
      });
    }

    // Ownership check: user who created, driver assigned, or admin
    const isOwner = booking.user && booking.user._id.toString() === req.user._id.toString();
    const isAssignedDriver = booking.driver && booking.driver._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAssignedDriver && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking.',
        error: 'FORBIDDEN_BOOKING_ACCESS',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking details retrieved successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an eligible booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
        error: 'BOOKING_NOT_FOUND',
      });
    }

    // Ownership check
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';
    const isDriver = booking.driver && booking.driver.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
        error: 'FORBIDDEN_CANCELLATION',
      });
    }

    // Cancellation eligibility: Cannot cancel already completed or cancelled trips
    const cancellableStatuses = ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY'];
    if (!cancellableStatuses.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled once it is in '${booking.status}' status.`,
        error: 'CANCELLATION_NOT_ALLOWED',
      });
    }

    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'Cancelled by user';
    booking.cancelledBy = isOwner ? 'PATIENT' : isDriver ? 'DRIVER' : 'ADMIN';

    await booking.save();

    // Release ambulance back to AVAILABLE
    if (booking.ambulance) {
      await Ambulance.findByIdAndUpdate(booking.ambulance, {
        availability: 'AVAILABLE',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled and ambulance released.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver accepts an incoming booking request
 * @route   PATCH /api/bookings/:id/accept
 * @access  Private (DRIVER)
 */
const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
        error: 'BOOKING_NOT_FOUND',
      });
    }

    if (booking.status !== 'REQUESTED') {
      return res.status(400).json({
        success: false,
        message: `This booking request is no longer pending (current status: ${booking.status}).`,
        error: 'BOOKING_NOT_PENDING',
      });
    }

    // Verify driver assignment
    if (booking.driver && booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This booking is assigned to another driver.',
        error: 'FORBIDDEN_DRIVER_ACTION',
      });
    }

    // If driver was not yet assigned, link current driver
    if (!booking.driver) {
      booking.driver = req.user._id;
    }

    booking.status = 'ACCEPTED';
    booking.acceptedAt = new Date();
    await booking.save();

    // Ensure ambulance is marked BUSY
    if (booking.ambulance) {
      await Ambulance.findByIdAndUpdate(booking.ambulance, {
        availability: 'BUSY',
      });
    }

    const updated = await Booking.findById(booking._id)
      .populate('ambulance')
      .populate('user', 'name phone email');

    res.status(200).json({
      success: true,
      message: 'Booking accepted! You can now proceed to pickup.',
      data: { booking: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver rejects an incoming booking request
 * @route   PATCH /api/bookings/:id/reject
 * @access  Private (DRIVER)
 */
const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
        error: 'BOOKING_NOT_FOUND',
      });
    }

    if (booking.status !== 'REQUESTED') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be rejected.',
        error: 'BOOKING_NOT_PENDING',
      });
    }

    booking.status = 'REJECTED';
    booking.cancellationReason = 'Driver unavailable / request declined';
    await booking.save();

    // Release ambulance back to AVAILABLE
    if (booking.ambulance) {
      await Ambulance.findByIdAndUpdate(booking.ambulance, {
        availability: 'AVAILABLE',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking request rejected. Ambulance returned to available pool.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update trip status through strict sequential state machine
 * @route   PATCH /api/bookings/:id/status
 * @access  Private (DRIVER)
 */
const updateTripStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
        error: 'BOOKING_NOT_FOUND',
      });
    }

    // Role check: driver assigned
    if (booking.driver && booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not the driver assigned to this booking.',
        error: 'FORBIDDEN_DRIVER_ACTION',
      });
    }

    // State machine sequence rules:
    // ACCEPTED -> ON_THE_WAY
    // ON_THE_WAY -> ARRIVED
    // ARRIVED -> TRIP_STARTED
    // TRIP_STARTED -> COMPLETED
    const validTransitions = {
      ACCEPTED: ['ON_THE_WAY'],
      ON_THE_WAY: ['ARRIVED'],
      ARRIVED: ['TRIP_STARTED'],
      TRIP_STARTED: ['COMPLETED'],
    };

    const allowedNextStatuses = validTransitions[booking.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid trip status transition from '${booking.status}' to '${status}'. Expected: ${allowedNextStatuses.join(', ') || 'No further transitions'}`,
        error: 'INVALID_STATUS_TRANSITION',
      });
    }

    booking.status = status;
    const now = new Date();

    if (status === 'ON_THE_WAY') booking.onTheWayAt = now;
    if (status === 'ARRIVED') booking.arrivedAt = now;
    if (status === 'TRIP_STARTED') booking.tripStartedAt = now;
    if (status === 'COMPLETED') {
      booking.completedAt = now;

      // Release ambulance back to AVAILABLE
      if (booking.ambulance) {
        await Ambulance.findByIdAndUpdate(booking.ambulance, {
          availability: 'AVAILABLE',
        });
      }

      // Increment driver's total trips
      await Driver.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { totalTripsCompleted: 1 } }
      );
    }

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('ambulance')
      .populate('user', 'name phone email');

    res.status(200).json({
      success: true,
      message: `Trip status updated to ${status}.`,
      data: { booking: updated },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  acceptBooking,
  rejectBooking,
  updateTripStatus,
};

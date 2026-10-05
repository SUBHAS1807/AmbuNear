const User = require('../models/User');
const Driver = require('../models/Driver');
const Ambulance = require('../models/Ambulance');
const Booking = require('../models/Booking');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Get live platform metrics (real database metrics only)
 * @route   GET /api/admin/metrics
 * @access  Private (ADMIN)
 */
const getMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $in: ['USER', 'PATIENT'] } });
    const totalDrivers = await Driver.countDocuments();
    const totalAmbulances = await Ambulance.countDocuments();
    const availableAmbulances = await Ambulance.countDocuments({
      availability: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
    });
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'TRIP_STARTED'] },
    });
    const completedBookings = await Booking.countDocuments({ status: 'COMPLETED' });
    const cancelledBookings = await Booking.countDocuments({ status: 'CANCELLED' });

    res.status(200).json({
      success: true,
      message: 'Platform metrics calculated successfully',
      data: {
        metrics: {
          totalUsers,
          totalDrivers,
          totalAmbulances,
          availableAmbulances,
          activeBookings,
          completedBookings,
          cancelledBookings,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of users with search, role filter, and pagination
 * @route   GET /api/admin/users
 * @access  Private (ADMIN)
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.accountStatus = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
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
 * @desc    Update user account status (ACTIVE / SUSPENDED)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (ADMIN)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { accountStatus } = req.body;
    if (!['ACTIVE', 'SUSPENDED', 'PENDING'].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid accountStatus specified.',
        error: 'INVALID_STATUS',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND',
      });
    }

    // Prevent suspending fellow admins
    if (user.role === 'ADMIN' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Admins cannot suspend other administrators.',
        error: 'ADMIN_MODIFICATION_RESTRICTED',
      });
    }

    user.accountStatus = accountStatus;
    await user.save();

    // Log admin audit action
    await AuditLog.create({
      adminUser: req.user._id,
      action: 'UPDATE_USER_STATUS',
      targetEntity: 'USER',
      targetId: user._id,
      details: `Changed accountStatus to ${accountStatus} for user ${user.email}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      message: `User status changed to ${accountStatus}.`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get drivers with license verification status
 * @route   GET /api/admin/drivers
 * @access  Private (ADMIN)
 */
const getDrivers = async (req, res, next) => {
  try {
    const { verificationStatus } = req.query;
    const query = {};
    if (verificationStatus) query.licenseVerificationStatus = verificationStatus;

    const drivers = await Driver.find(query)
      .populate('user', 'name email phone accountStatus createdAt')
      .populate('assignedAmbulance', 'vehicleNumber ambulanceType availability')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Drivers retrieved successfully',
      data: { drivers },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify or reject a driver application
 * @route   PATCH /api/admin/drivers/:id/verification
 * @access  Private (ADMIN)
 */
const verifyDriver = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status.',
        error: 'INVALID_STATUS',
      });
    }

    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found.',
        error: 'DRIVER_NOT_FOUND',
      });
    }

    driver.licenseVerificationStatus = status;
    await driver.save();

    // If driver is verified, activate their user account
    if (status === 'VERIFIED') {
      await User.findByIdAndUpdate(driver.user, { accountStatus: 'ACTIVE' });
    }

    // Audit log
    await AuditLog.create({
      adminUser: req.user._id,
      action: 'VERIFY_DRIVER',
      targetEntity: 'DRIVER',
      targetId: driver._id,
      details: `Verification set to ${status} for driver license ${driver.licenseNumber}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      message: `Driver license verification updated to ${status}.`,
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered ambulances with fleet info
 * @route   GET /api/admin/ambulances
 * @access  Private (ADMIN)
 */
const getAmbulances = async (req, res, next) => {
  try {
    const ambulances = await Ambulance.find()
      .populate('driver', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Ambulance fleet retrieved successfully',
      data: { ambulances },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify or suspend an ambulance vehicle
 * @route   PATCH /api/admin/ambulances/:id/verification
 * @access  Private (ADMIN)
 */
const verifyAmbulance = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status.',
        error: 'INVALID_STATUS',
      });
    }

    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found.',
        error: 'AMBULANCE_NOT_FOUND',
      });
    }

    ambulance.verificationStatus = status;
    await ambulance.save();

    // Audit log
    await AuditLog.create({
      adminUser: req.user._id,
      action: 'VERIFY_AMBULANCE',
      targetEntity: 'AMBULANCE',
      targetId: ambulance._id,
      details: `Vehicle ${ambulance.vehicleNumber} verification set to ${status}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      message: `Ambulance vehicle verification updated to ${status}.`,
      data: { ambulance },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all platform bookings for monitoring and auditing
 * @route   GET /api/admin/bookings
 * @access  Private (ADMIN)
 */
const getBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 25 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name phone email')
      .populate('driver', 'name phone email')
      .populate('ambulance', 'vehicleNumber ambulanceType contactNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      message: 'All platform bookings retrieved successfully',
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
 * @desc    Get recent audit logs
 * @route   GET /api/admin/audit-logs
 * @access  Private (ADMIN)
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('adminUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved',
      data: { logs },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetrics,
  getUsers,
  updateUserStatus,
  getDrivers,
  verifyDriver,
  getAmbulances,
  verifyAmbulance,
  getBookings,
  getAuditLogs,
};

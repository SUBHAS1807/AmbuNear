const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

/**
 * Generate JWT token and optionally set HttpOnly Cookie
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const jwtSecret = process.env.JWT_SECRET || 'ambunear_default_jwt_secret_dev_key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    jwtSecret,
    { expiresIn }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
      },
    },
  });
};

/**
 * @desc    Register a new user or driver applicant
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, licenseNumber } = req.body;

    // Prevent direct escalation to ADMIN
    if (role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be self-registered. Use the bootstrap utility.',
        error: 'ADMIN_REGISTRATION_FORBIDDEN',
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        error: 'DUPLICATE_EMAIL',
      });
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Determine target role: Default to PATIENT. If DRIVER is requested, require driver license.
    const assignedRole = role === 'DRIVER' ? 'DRIVER' : 'PATIENT';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: assignedRole,
      accountStatus: assignedRole === 'DRIVER' ? 'PENDING' : 'ACTIVE',
    });

    // If driver, create associated Driver profile
    if (assignedRole === 'DRIVER') {
      await Driver.create({
        user: newUser._id,
        licenseNumber: licenseNumber || 'PENDING-LICENSE',
        licenseVerificationStatus: 'PENDING',
        isAvailable: true,
      });

      return sendTokenResponse(
        newUser,
        201,
        res,
        'Driver application submitted successfully! Your account will be verified by an administrator.'
      );
    }

    return sendTokenResponse(
      newUser,
      201,
      res,
      'Account registered successfully! Welcome to AmbuNear.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user with passwordHash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS',
      });
    }

    // Verify account status
    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact platform administration.',
        error: 'ACCOUNT_SUSPENDED',
      });
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private (JWT protected)
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let driverProfile = null;

    if (user.role === 'DRIVER') {
      driverProfile = await Driver.findOne({ user: user._id }).populate('assignedAmbulance');
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user,
        ...(driverProfile && { driverProfile }),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out current user and clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {},
  });
};

/**
 * @desc    Update user profile name & phone
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User record not found',
        error: 'USER_NOT_FOUND',
      });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
};

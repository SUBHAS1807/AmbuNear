const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verifies JWT from Header or Cookie
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to HttpOnly cookie if present
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to proceed.',
      error: 'NO_TOKEN_PROVIDED',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'ambunear_default_jwt_secret_dev_key';
    const decoded = jwt.verify(token, jwtSecret);

    // Verify user still exists in database
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
        error: 'USER_NOT_FOUND',
      });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
        error: 'ACCOUNT_SUSPENDED',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.',
      error: 'INVALID_TOKEN',
    });
  }
};

/**
 * Grant access to specific roles: e.g. authorize('ADMIN', 'DRIVER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'UNKNOWN'}' is not authorized to access this resource.`,
        error: 'FORBIDDEN_ROLE',
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};

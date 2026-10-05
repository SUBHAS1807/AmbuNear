const rateLimit = require('express-rate-limit');

// Rate limiter for login & registration attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // 300 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again shortly.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};

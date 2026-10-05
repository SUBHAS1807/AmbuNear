/**
 * Centralized Error Handling Middleware
 * Ensures all errors adhere to the standard JSON structure:
 * {
 *   success: false,
 *   message: string,
 *   error: string (code),
 *   errors?: array (field-level validation details)
 * }
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let errors = err.errors || undefined;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id: ${err.value}`;
    errorCode = 'INVALID_ID';
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account or record already exists with this ${field}.`;
    errorCode = `DUPLICATE_${field.toUpperCase()}`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errorCode = 'VALIDATION_ERROR';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
    errorCode = 'TOKEN_EXPIRED';
  }

  // Handle JWT invalid signature
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
    errorCode = 'INVALID_TOKEN';
  }

  // In production, do not leak internal database errors
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorCode,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

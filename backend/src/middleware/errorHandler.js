import { logger } from '../utils/logger.js';

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error: ${error.message}`, {
    statusCode: error.statusCode,
    code: error.code,
    stack: err.stack
  });

  // Default error
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code || 'INTERNAL_ERROR';

  // Ethers.js errors
  if (err.code === 'CALL_EXCEPTION') {
    statusCode = 400;
    message = 'Contract call failed';
    code = 'CONTRACT_CALL_FAILED';
  }

  if (err.code === 'NETWORK_ERROR') {
    statusCode = 503;
    message = 'Blockchain network unavailable';
    code = 'NETWORK_ERROR';
  }

  if (err.code === 'INSUFFICIENT_FUNDS') {
    statusCode = 400;
    message = 'Insufficient funds for transaction';
    code = 'INSUFFICIENT_FUNDS';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(error);
};

export { errorHandler, notFound, AppError };

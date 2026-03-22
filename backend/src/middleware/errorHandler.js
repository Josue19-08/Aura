import { logger } from '../utils/logger.js';

// Custom error class for operational errors
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
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Log error server-side (always)
  logger.error(`${req.method} ${req.originalUrl} — ${message}`, {
    statusCode,
    code,
    stack: err.stack,
    body: req.body
  });

  // ── Ethers.js / blockchain errors ──────────────────────────────────────────

  if (err.code === 'CALL_EXCEPTION') {
    statusCode = 400;
    message = 'Smart contract call failed. The transaction may have reverted.';
    code = 'CONTRACT_CALL_FAILED';
  }

  if (err.code === 'NETWORK_ERROR' || err.code === 'SERVER_ERROR') {
    statusCode = 503;
    message = 'Blockchain network unavailable. Please try again later.';
    code = 'NETWORK_ERROR';
  }

  if (err.code === 'INSUFFICIENT_FUNDS') {
    statusCode = 402;
    message = 'Insufficient funds to execute this transaction.';
    code = 'INSUFFICIENT_FUNDS';
  }

  if (err.code === 'NONCE_EXPIRED' || err.code === 'REPLACEMENT_UNDERPRICED') {
    statusCode = 400;
    message = 'Transaction nonce conflict. Please retry.';
    code = 'TRANSACTION_NONCE_ERROR';
  }

  if (err.code === 'TIMEOUT') {
    statusCode = 504;
    message = 'Blockchain request timed out. Please try again.';
    code = 'TIMEOUT';
  }

  // ── IPFS errors ────────────────────────────────────────────────────────────

  if (
    err.code === 'IPFS_UPLOAD_FAILED' ||
    err.code === 'IPFS_RETRIEVAL_FAILED' ||
    (err.message && err.message.toLowerCase().includes('ipfs')) ||
    (err.message && err.message.toLowerCase().includes('pinata'))
  ) {
    statusCode = err.statusCode || 503;
    message = 'IPFS service unavailable. Failed to store or retrieve metadata.';
    code = err.code || 'IPFS_ERROR';
  }

  // ── Validation errors ──────────────────────────────────────────────────────

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
  }

  // ── JSON parse errors ──────────────────────────────────────────────────────

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body.';
    code = 'INVALID_JSON';
  }

  // ── Payload too large ──────────────────────────────────────────────────────

  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request payload is too large.';
    code = 'PAYLOAD_TOO_LARGE';
  }

  // Build response — hide stack in production
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(error);
};

export { errorHandler, notFound, AppError };

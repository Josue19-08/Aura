import { AppError } from './errorHandler.js';

// Validate Ethereum address (0x + 40 hex chars)
const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Validate product registration data
const validateProductRegistration = (req, res, next) => {
  const { lotId, productName, origin, metadata } = req.body;

  if (!lotId || typeof lotId !== 'string' || lotId.trim().length === 0) {
    return next(new AppError('lotId is required and must be a non-empty string', 400, 'INVALID_LOT_ID'));
  }

  if (lotId.trim().length < 3 || lotId.trim().length > 50) {
    return next(new AppError('lotId must be between 3 and 50 characters', 400, 'INVALID_LOT_ID'));
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(lotId.trim())) {
    return next(new AppError('lotId must contain only letters, numbers, hyphens, or underscores', 400, 'INVALID_LOT_ID'));
  }

  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    return next(new AppError('productName is required and must be a non-empty string', 400, 'INVALID_PRODUCT_NAME'));
  }

  if (productName.trim().length < 3 || productName.trim().length > 100) {
    return next(new AppError('productName must be between 3 and 100 characters', 400, 'INVALID_PRODUCT_NAME'));
  }

  if (!origin || typeof origin !== 'string' || origin.trim().length === 0) {
    return next(new AppError('origin is required and must be a non-empty string', 400, 'INVALID_ORIGIN'));
  }

  if (origin.trim().length > 200) {
    return next(new AppError('origin must not exceed 200 characters', 400, 'INVALID_ORIGIN'));
  }

  if (metadata !== undefined && (typeof metadata !== 'object' || Array.isArray(metadata) || metadata === null)) {
    return next(new AppError('metadata must be a plain object', 400, 'INVALID_METADATA'));
  }

  req.body.lotId = lotId.trim();
  req.body.productName = productName.trim();
  req.body.origin = origin.trim();

  next();
};

// Validate custody transfer data
const validateCustodyTransfer = (req, res, next) => {
  const { productId, newCustodian, locationNote } = req.body;

  if (!productId || !Number.isInteger(Number(productId)) || Number(productId) <= 0) {
    return next(new AppError('productId must be a positive integer', 400, 'INVALID_PRODUCT_ID'));
  }

  if (!newCustodian || !isValidAddress(newCustodian)) {
    return next(new AppError('newCustodian must be a valid Ethereum address (0x + 40 hex chars)', 400, 'INVALID_ADDRESS'));
  }

  if (!locationNote || typeof locationNote !== 'string' || locationNote.trim().length === 0) {
    return next(new AppError('locationNote is required and must be a non-empty string', 400, 'INVALID_LOCATION_NOTE'));
  }

  if (locationNote.trim().length > 200) {
    return next(new AppError('locationNote must not exceed 200 characters', 400, 'INVALID_LOCATION_NOTE'));
  }

  req.body.productId = Number(productId);
  req.body.newCustodian = newCustodian.trim();
  req.body.locationNote = locationNote.trim();

  next();
};

// Validate product ID route parameter
const validateProductId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(new AppError('Product ID must be a positive integer', 400, 'INVALID_PRODUCT_ID'));
  }

  req.params.id = Number(id);
  next();
};

export {
  isValidAddress,
  validateProductRegistration,
  validateCustodyTransfer,
  validateProductId
};

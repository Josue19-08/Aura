import { AppError } from './errorHandler.js';

// Validate Ethereum address
const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Validate product registration data
const validateProductRegistration = (req, res, next) => {
  const { lotId, productName, origin, ipfsHash } = req.body;

  // Check required fields
  if (!lotId || typeof lotId !== 'string' || lotId.trim().length === 0) {
    return next(new AppError('lotId is required and must be a non-empty string', 400, 'INVALID_LOT_ID'));
  }

  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    return next(new AppError('productName is required and must be a non-empty string', 400, 'INVALID_PRODUCT_NAME'));
  }

  if (!origin || typeof origin !== 'string' || origin.trim().length === 0) {
    return next(new AppError('origin is required and must be a non-empty string', 400, 'INVALID_ORIGIN'));
  }

  if (!ipfsHash || typeof ipfsHash !== 'string' || ipfsHash.trim().length === 0) {
    return next(new AppError('ipfsHash is required and must be a non-empty string', 400, 'INVALID_IPFS_HASH'));
  }

  // Validate IPFS hash format (basic check)
  if (!ipfsHash.startsWith('Qm') && !ipfsHash.startsWith('baf')) {
    return next(new AppError('Invalid IPFS hash format', 400, 'INVALID_IPFS_HASH'));
  }

  // Trim strings
  req.body.lotId = lotId.trim();
  req.body.productName = productName.trim();
  req.body.origin = origin.trim();
  req.body.ipfsHash = ipfsHash.trim();

  next();
};

// Validate custody transfer data
const validateCustodyTransfer = (req, res, next) => {
  const { productId, newCustodian, locationNote } = req.body;

  // Check product ID
  if (!productId || !Number.isInteger(Number(productId)) || Number(productId) <= 0) {
    return next(new AppError('productId must be a positive integer', 400, 'INVALID_PRODUCT_ID'));
  }

  // Check new custodian address
  if (!newCustodian || !isValidAddress(newCustodian)) {
    return next(new AppError('newCustodian must be a valid Ethereum address', 400, 'INVALID_ADDRESS'));
  }

  // Check location note
  if (!locationNote || typeof locationNote !== 'string' || locationNote.trim().length === 0) {
    return next(new AppError('locationNote is required and must be a non-empty string', 400, 'INVALID_LOCATION_NOTE'));
  }

  // Convert to proper types
  req.body.productId = Number(productId);
  req.body.newCustodian = newCustodian.trim();
  req.body.locationNote = locationNote.trim();

  next();
};

// Validate product ID parameter
const validateProductId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return next(new AppError('Product ID must be a positive integer', 400, 'INVALID_PRODUCT_ID'));
  }

  req.params.id = Number(id);
  next();
};

export {
  validateProductRegistration,
  validateCustodyTransfer,
  validateProductId
};

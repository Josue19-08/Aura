import { jest } from '@jest/globals';
import {
  isValidAddress,
  validateProductRegistration,
  validateCustodyTransfer,
  validateProductId
} from '../validator.js';

// Helper: build a mock Express context
function mockContext(body = {}, params = {}) {
  const req = { body: { ...body }, params: { ...params } };
  const res = {};
  const next = jest.fn();
  return { req, res, next };
}

// ─────────────────────────────────────────────────────────────────────────────
// isValidAddress
// ─────────────────────────────────────────────────────────────────────────────
describe('isValidAddress', () => {
  it('should accept a valid Ethereum address', () => {
    expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true);
  });

  it('should accept a lowercase address', () => {
    expect(isValidAddress('0xabcdef1234567890abcdef1234567890abcdef12')).toBe(true);
  });

  it('should reject address without 0x prefix', () => {
    expect(isValidAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(false);
  });

  it('should reject address shorter than 42 chars', () => {
    expect(isValidAddress('0x742d35')).toBe(false);
  });

  it('should reject non-hex characters', () => {
    expect(isValidAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidAddress('')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateProductRegistration
// ─────────────────────────────────────────────────────────────────────────────
describe('validateProductRegistration', () => {
  const validBody = {
    lotId: 'LOT-001',
    productName: 'Ibuprofeno 400mg',
    origin: 'Bogotá, Colombia',
    metadata: { manufacturer: 'Pharma Corp' }
  };

  it('should pass validation with valid data', () => {
    const { req, res, next } = mockContext(validBody);
    validateProductRegistration(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should trim whitespace from string fields', () => {
    const { req, res, next } = mockContext({ ...validBody, lotId: '  LOT-001  ' });
    validateProductRegistration(req, res, next);
    expect(req.body.lotId).toBe('LOT-001');
  });

  it('should fail if lotId is missing', () => {
    const { req, res, next } = mockContext({ ...validBody, lotId: '' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_LOT_ID');
    expect(err.statusCode).toBe(400);
  });

  it('should fail if lotId is too short (< 3 chars)', () => {
    const { req, res, next } = mockContext({ ...validBody, lotId: 'AB' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_LOT_ID');
  });

  it('should fail if lotId is too long (> 50 chars)', () => {
    const { req, res, next } = mockContext({ ...validBody, lotId: 'A'.repeat(51) });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_LOT_ID');
  });

  it('should fail if lotId contains special chars', () => {
    const { req, res, next } = mockContext({ ...validBody, lotId: 'LOT@001!' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_LOT_ID');
  });

  it('should fail if productName is missing', () => {
    const { req, res, next } = mockContext({ ...validBody, productName: '' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_NAME');
  });

  it('should fail if productName is too short (< 3 chars)', () => {
    const { req, res, next } = mockContext({ ...validBody, productName: 'AB' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_NAME');
  });

  it('should fail if productName is too long (> 100 chars)', () => {
    const { req, res, next } = mockContext({ ...validBody, productName: 'A'.repeat(101) });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_NAME');
  });

  it('should fail if origin is missing', () => {
    const { req, res, next } = mockContext({ ...validBody, origin: '' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_ORIGIN');
  });

  it('should fail if origin is too long (> 200 chars)', () => {
    const { req, res, next } = mockContext({ ...validBody, origin: 'A'.repeat(201) });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_ORIGIN');
  });

  it('should fail if metadata is an array', () => {
    const { req, res, next } = mockContext({ ...validBody, metadata: [1, 2, 3] });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_METADATA');
  });

  it('should fail if metadata is a string', () => {
    const { req, res, next } = mockContext({ ...validBody, metadata: 'invalid' });
    validateProductRegistration(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_METADATA');
  });

  it('should pass when metadata is omitted (optional)', () => {
    const { lotId, productName, origin } = validBody;
    const { req, res, next } = mockContext({ lotId, productName, origin });
    validateProductRegistration(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateCustodyTransfer
// ─────────────────────────────────────────────────────────────────────────────
describe('validateCustodyTransfer', () => {
  const validBody = {
    productId: 1,
    newCustodian: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    locationNote: 'Warehouse A'
  };

  it('should pass validation with valid data', () => {
    const { req, res, next } = mockContext(validBody);
    validateCustodyTransfer(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should coerce productId to Number', () => {
    const { req, res, next } = mockContext({ ...validBody, productId: '5' });
    validateCustodyTransfer(req, res, next);
    expect(req.body.productId).toBe(5);
  });

  it('should fail if productId is zero', () => {
    const { req, res, next } = mockContext({ ...validBody, productId: 0 });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should fail if productId is negative', () => {
    const { req, res, next } = mockContext({ ...validBody, productId: -1 });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should fail if productId is not a number', () => {
    const { req, res, next } = mockContext({ ...validBody, productId: 'abc' });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should fail with invalid Ethereum address', () => {
    const { req, res, next } = mockContext({ ...validBody, newCustodian: 'not-an-address' });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_ADDRESS');
  });

  it('should fail if newCustodian is missing', () => {
    const { req, res, next } = mockContext({ ...validBody, newCustodian: '' });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_ADDRESS');
  });

  it('should fail if locationNote is missing', () => {
    const { req, res, next } = mockContext({ ...validBody, locationNote: '' });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_LOCATION_NOTE');
  });

  it('should fail if locationNote exceeds 200 chars', () => {
    const { req, res, next } = mockContext({ ...validBody, locationNote: 'A'.repeat(201) });
    validateCustodyTransfer(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_LOCATION_NOTE');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateProductId
// ─────────────────────────────────────────────────────────────────────────────
describe('validateProductId', () => {
  it('should pass with a valid numeric ID', () => {
    const { req, res, next } = mockContext({}, { id: '42' });
    validateProductId(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.params.id).toBe(42);
  });

  it('should fail with ID = 0', () => {
    const { req, res, next } = mockContext({}, { id: '0' });
    validateProductId(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should fail with negative ID', () => {
    const { req, res, next } = mockContext({}, { id: '-5' });
    validateProductId(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should fail with non-numeric ID', () => {
    const { req, res, next } = mockContext({}, { id: 'abc' });
    validateProductId(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should fail with float ID', () => {
    const { req, res, next } = mockContext({}, { id: '1.5' });
    validateProductId(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.code).toBe('INVALID_PRODUCT_ID');
  });
});

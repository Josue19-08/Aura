import { jest } from '@jest/globals';
import { errorHandler, notFound, AppError } from '../errorHandler.js';

describe('AppError', () => {
  it('should create error with message, statusCode, and code', () => {
    const err = new AppError('test error', 400, 'TEST_ERROR');
    expect(err.message).toBe('test error');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST_ERROR');
    expect(err.isOperational).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  it('should capture stack trace', () => {
    const err = new AppError('msg', 500, 'ERR');
    expect(err.stack).toBeDefined();
  });
});

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', originalUrl: '/test', body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  it('should handle AppError with correct status and code', () => {
    const err = new AppError('Not found', 404, 'NOT_FOUND');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'NOT_FOUND', message: 'Not found' })
      })
    );
  });

  it('should default to 500 for unknown errors', () => {
    const err = new Error('Something broke');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INTERNAL_ERROR' })
      })
    );
  });

  it('should handle CALL_EXCEPTION blockchain error', () => {
    const err = new Error('contract revert');
    err.code = 'CALL_EXCEPTION';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'CONTRACT_CALL_FAILED' })
      })
    );
  });

  it('should handle NETWORK_ERROR blockchain error', () => {
    const err = new Error('network unavailable');
    err.code = 'NETWORK_ERROR';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'NETWORK_ERROR' })
      })
    );
  });

  it('should handle INSUFFICIENT_FUNDS error with 402', () => {
    const err = new Error('not enough gas');
    err.code = 'INSUFFICIENT_FUNDS';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'INSUFFICIENT_FUNDS' })
      })
    );
  });

  it('should handle TIMEOUT error with 504', () => {
    const err = new Error('request timed out');
    err.code = 'TIMEOUT';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(504);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'TIMEOUT' })
      })
    );
  });

  it('should handle IPFS_UPLOAD_FAILED error as 503', () => {
    const err = new AppError('upload failed', 503, 'IPFS_UPLOAD_FAILED');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'IPFS_UPLOAD_FAILED' })
      })
    );
  });

  it('should handle errors mentioning IPFS in message', () => {
    const err = new Error('Failed to connect to IPFS gateway');
    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'IPFS_ERROR' })
      })
    );
  });

  it('should handle ValidationError name', () => {
    const err = new Error('field required');
    err.name = 'ValidationError';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'VALIDATION_ERROR' })
      })
    );
  });

  it('should handle JSON parse error', () => {
    const err = new Error('invalid json');
    err.type = 'entity.parse.failed';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'INVALID_JSON' })
      })
    );
  });

  it('should handle payload too large error', () => {
    const err = new Error('too large');
    err.type = 'entity.too.large';
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'PAYLOAD_TOO_LARGE' })
      })
    );
  });

  it('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'development';
    const err = new AppError('test', 400, 'ERR');
    errorHandler(err, req, res, next);

    const call = res.json.mock.calls[0][0];
    expect(call.error.stack).toBeDefined();
  });

  it('should NOT include stack trace in production mode', () => {
    process.env.NODE_ENV = 'production';
    const err = new AppError('test', 400, 'ERR');
    errorHandler(err, req, res, next);

    const call = res.json.mock.calls[0][0];
    expect(call.error.stack).toBeUndefined();
    process.env.NODE_ENV = 'test';
  });
});

describe('notFound middleware', () => {
  it('should call next with 404 AppError', () => {
    const req = { originalUrl: '/unknown' };
    const res = {};
    const next = jest.fn();

    notFound(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toContain('/unknown');
  });
});

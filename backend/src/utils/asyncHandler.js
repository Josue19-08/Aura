/**
 * Wraps an async route handler so errors are automatically forwarded to next().
 * Eliminates the need for try/catch in every route.
 *
 * @param {Function} fn - Async express route handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export { asyncHandler };

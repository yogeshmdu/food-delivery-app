// Authentication middleware for admin routes
const { ADMIN_KEY } = require('../config');

/**
 * Validates admin API key from headers
 * @param {import('http').IncomingMessage} req 
 * @returns {boolean}
 */
function isAuthenticatedAdmin(req) {
  const providedKey = req.headers['x-admin-key'];
  return Boolean(providedKey && providedKey === ADMIN_KEY);
}

module.exports = {
  isAuthenticatedAdmin
};

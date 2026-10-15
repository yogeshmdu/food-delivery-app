// HTTP JSON response helpers

/**
 * Send JSON response
 * @param {import('http').ServerResponse} res 
 * @param {number} statusCode 
 * @param {any} data 
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(data));
}

/**
 * Send standard JSON error response
 * @param {import('http').ServerResponse} res 
 * @param {number} statusCode 
 * @param {string} message 
 */
function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

module.exports = {
  sendJson,
  sendError
};

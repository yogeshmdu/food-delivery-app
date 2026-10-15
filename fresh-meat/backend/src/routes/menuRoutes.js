// Menu routes handler
const db = require('../models/database');
const { sendJson } = require('../utils/response');

/**
 * Handle GET /api/menu
 */
function handleGetMenu(req, res) {
  const menu = db.getMenu();
  sendJson(res, 200, menu);
}

module.exports = {
  handleGetMenu
};

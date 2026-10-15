// Main API routing dispatcher
const { handleGetMenu } = require('./menuRoutes');
const {
  handleCreateOrder,
  handleGetOrders,
  handleGetOrderById
} = require('./orderRoutes');
const {
  handleGetAdminOrders,
  handleUpdateOrderStatus,
  handleUpdateProduct
} = require('./adminRoutes');
const { sendError } = require('../utils/response');

/**
 * Dispatches API requests based on path and method
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {URL} parsedUrl 
 */
async function handleApiRequest(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Menu routes
  if (pathname === '/api/menu' && method === 'GET') {
    return handleGetMenu(req, res);
  }

  // Customer order routes
  if (pathname === '/api/orders' && method === 'POST') {
    return handleCreateOrder(req, res);
  }

  if (pathname === '/api/orders' && method === 'GET') {
    return handleGetOrders(req, res, parsedUrl.searchParams);
  }

  const orderMatch = pathname.match(/^\/api\/orders\/([A-Za-z0-9]+)$/);
  if (orderMatch && method === 'GET') {
    return handleGetOrderById(req, res, orderMatch[1], parsedUrl.searchParams);
  }

  // Admin routes
  if (pathname === '/api/admin/orders' && method === 'GET') {
    return handleGetAdminOrders(req, res);
  }

  const adminOrderMatch = pathname.match(/^\/api\/admin\/orders\/([A-Za-z0-9]+)$/);
  if (adminOrderMatch && method === 'PATCH') {
    return handleUpdateOrderStatus(req, res, adminOrderMatch[1]);
  }

  const adminProductMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/);
  if (adminProductMatch && method === 'PATCH') {
    return handleUpdateProduct(req, res, adminProductMatch[1]);
  }

  // Unknown API endpoint
  return sendError(res, 404, 'Not found.');
}

module.exports = {
  handleApiRequest
};

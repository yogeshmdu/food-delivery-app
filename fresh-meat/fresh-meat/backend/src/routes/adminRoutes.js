// Admin management route handlers
const db = require('../models/database');
const { parseJsonBody } = require('../middleware/bodyParser');
const { isAuthenticatedAdmin } = require('../middleware/auth');
const { sendJson, sendError } = require('../utils/response');

/**
 * Handle GET /api/admin/orders
 */
function handleGetAdminOrders(req, res) {
  if (!isAuthenticatedAdmin(req)) {
    return sendError(res, 401, 'Wrong admin key.');
  }

  const allOrders = db.getAllOrdersReversed();
  return sendJson(res, 200, allOrders);
}

/**
 * Handle PATCH /api/admin/orders/:id
 */
async function handleUpdateOrderStatus(req, res, orderId) {
  if (!isAuthenticatedAdmin(req)) {
    return sendError(res, 401, 'Wrong admin key.');
  }

  const body = await parseJsonBody(req);
  const updatedOrder = db.updateOrderStatus(orderId, body.status);

  if (!updatedOrder) {
    return sendError(res, 400, 'Bad request.');
  }

  return sendJson(res, 200, updatedOrder);
}

/**
 * Handle PATCH /api/admin/products/:id
 */
async function handleUpdateProduct(req, res, productId) {
  if (!isAuthenticatedAdmin(req)) {
    return sendError(res, 401, 'Wrong admin key.');
  }

  const body = await parseJsonBody(req);
  const updatedProduct = db.updateProduct(productId, {
    price: body.price,
    inStock: body.inStock
  });

  if (!updatedProduct) {
    return sendError(res, 404, 'Not found.');
  }

  return sendJson(res, 200, updatedProduct);
}

module.exports = {
  handleGetAdminOrders,
  handleUpdateOrderStatus,
  handleUpdateProduct
};

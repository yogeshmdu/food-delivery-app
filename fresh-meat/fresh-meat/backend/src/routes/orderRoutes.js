// Customer order route handlers
const db = require('../models/database');
const { parseJsonBody } = require('../middleware/bodyParser');
const { cleanString, isValidPhone, isValidQuantity } = require('../utils/sanitizer');
const { sendJson, sendError } = require('../utils/response');

/**
 * Handle POST /api/orders
 */
async function handleCreateOrder(req, res) {
  const body = await parseJsonBody(req);
  const customer = body.customer || {};

  const name = cleanString(customer.name, 60);
  const phone = cleanString(customer.phone, 10);
  const address = cleanString(customer.address, 250);

  if (!name || !isValidPhone(phone) || !address) {
    return sendError(res, 400, 'Name, 10-digit phone and address are required.');
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return sendError(res, 400, 'Cart is empty.');
  }

  const orderLines = [];
  for (const item of body.items) {
    const product = db.getProductById(item.id);
    const qty = Math.floor(Number(item.qty));

    if (!product || !product.inStock || !isValidQuantity(qty, 1, 20)) {
      return sendError(res, 400, 'An item is unavailable. Please refresh.');
    }

    orderLines.push({
      id: product.id,
      name: product.name,
      unit: product.unit,
      price: product.price,
      qty
    });
  }

  const subtotal = orderLines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const shop = db.getShop();

  if (subtotal < shop.minOrder) {
    return sendError(res, 400, `Minimum order is Rs. ${shop.minOrder}.`);
  }

  const newOrder = db.createOrder({
    customer: { name, phone, address },
    items: orderLines,
    slot: body.slot,
    payment: body.payment
  });

  return sendJson(res, 201, newOrder);
}

/**
 * Handle GET /api/orders?phone=...
 */
function handleGetOrders(req, res, searchParams) {
  const phone = cleanString(searchParams.get('phone'), 10);

  if (!isValidPhone(phone)) {
    return sendJson(res, 200, []);
  }

  const matchingOrders = db.getOrdersByPhone(phone);
  return sendJson(res, 200, matchingOrders);
}

/**
 * Handle GET /api/orders/:id?phone=...
 */
function handleGetOrderById(req, res, orderId, searchParams) {
  const phone = searchParams.get('phone') || '';
  const order = db.getOrderById(orderId);

  if (!order || order.customer.phone !== phone) {
    return sendError(res, 404, 'Order not found.');
  }

  return sendJson(res, 200, order);
}

module.exports = {
  handleCreateOrder,
  handleGetOrders,
  handleGetOrderById
};

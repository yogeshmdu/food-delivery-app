// Application configuration and constants
const path = require('path');

// Base directories
const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

const ORDER_STATUSES = [
  'placed',
  'accepted',
  'packing',
  'out_for_delivery',
  'delivered',
  'rejected'
];

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash'];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

module.exports = {
  ROOT_DIR,
  BACKEND_DIR,
  FRONTEND_DIR,
  DATA_DIR,
  DB_FILE,
  PORT,
  ADMIN_KEY,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  MIME_TYPES
};

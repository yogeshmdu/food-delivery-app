// Static file server serving frontend files with security checks
const fs = require('fs');
const path = require('path');
const { FRONTEND_DIR, ROOT_DIR, MIME_TYPES } = require('../config');

/**
 * Resolves request path to local filesystem path
 * @param {string} pathname 
 * @returns {string}
 */
function resolveFilePath(pathname) {
  let relativePath = pathname;

  if (relativePath === '/' || relativePath === '') {
    relativePath = 'index.html';
  } else if (relativePath === '/admin' || relativePath === '/admin/') {
    relativePath = 'admin.html';
  }

  // Backward compatibility aliases
  if (relativePath === '/style.css') {
    relativePath = 'css/customer.css';
  } else if (relativePath === '/app.js') {
    relativePath = 'js/customer/main.js';
  }

  const safePath = path.normalize(decodeURIComponent(relativePath)).replace(/^(\.\.[\/\\])+/, '');
  
  // Try FRONTEND_DIR first
  const frontendPath = path.join(FRONTEND_DIR, safePath);
  if (frontendPath.startsWith(FRONTEND_DIR) && fs.existsSync(frontendPath)) {
    return frontendPath;
  }

  // Fallback to legacy public directory if exists
  const legacyPublicPath = path.join(ROOT_DIR, 'public', safePath);
  if (legacyPublicPath.startsWith(path.join(ROOT_DIR, 'public')) && fs.existsSync(legacyPublicPath)) {
    return legacyPublicPath;
  }

  return frontendPath;
}

/**
 * Serves static assets from frontend directory
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {string} pathname 
 */
function serveStaticFile(req, res, pathname) {
  const filePath = resolveFilePath(pathname);

  // Security check: ensure path is within allowed directories
  const isInsideFrontend = filePath.startsWith(FRONTEND_DIR);
  const isInsidePublic = filePath.startsWith(path.join(ROOT_DIR, 'public'));

  if (!isInsideFrontend && !isInsidePublic) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Internal Server Error');
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': data.length,
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
}

module.exports = {
  serveStaticFile
};

// Core HTTP application server
const http = require('http');
const { PORT, ADMIN_KEY } = require('./config');
const { handleApiRequest } = require('./routes/router');
const { serveStaticFile } = require('./middleware/staticServer');

/**
 * Creates the HTTP application server instance
 */
function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = parsedUrl.pathname;

      if (pathname.startsWith('/api/')) {
        await handleApiRequest(req, res, parsedUrl);
      } else {
        serveStaticFile(req, res, pathname);
      }
    } catch (err) {
      console.error('Unhandled server error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    }
  });
}

/**
 * Starts the server and listens on configured PORT
 */
function startServer(port = PORT) {
  const server = createServer();
  server.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(` Fresh to Home - Madurai Mertal Meats Server`);
    console.log(`==================================================`);
    console.log(` Customer App : http://localhost:${port}`);
    console.log(` Shop Admin   : http://localhost:${port}/admin  (key: ${ADMIN_KEY})`);
    console.log(` API Endpoint : http://localhost:${port}/api/menu`);
    console.log(`==================================================\n`);
  });
  return server;
}

module.exports = {
  createServer,
  startServer
};

// JSON request body parser with safety limit

const MAX_PAYLOAD_BYTES = 100 * 1024; // 100KB limit

/**
 * Parses JSON request body
 * @param {import('http').IncomingMessage} req 
 * @returns {Promise<Record<string, any>>}
 */
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let payload = '';

    req.on('data', (chunk) => {
      payload += chunk;
      if (payload.length > MAX_PAYLOAD_BYTES) {
        req.destroy(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!payload.trim()) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(payload);
        resolve(parsed && typeof parsed === 'object' ? parsed : {});
      } catch {
        resolve({});
      }
    });

    req.on('error', () => {
      resolve({});
    });
  });
}

module.exports = {
  parseJsonBody
};

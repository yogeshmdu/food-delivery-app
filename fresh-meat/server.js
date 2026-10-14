// Fresh to Home - zero-dependency Node server (API + static files). Run: node server.js
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000, KEY = process.env.ADMIN_KEY || 'admin123';
const FILE = path.join(__dirname, 'data', 'db.json'), PUB = path.join(__dirname, 'public');
const P = (id, cat, name, unit, price) => ({ id, cat, name, unit, price, inStock: true });
const seed = () => ({
  shop: { name: 'Madurai Mertal Meats', address: '120/2 Mattuthavani, Bus stand opposite', phone: '8098621639',
          deliveryFee: 30, minOrder: 150, slots: ['7 - 9 AM', '9 - 11 AM', '4 - 6 PM', '6 - 8 PM'] },
  categories: ['Chicken', 'Mutton', 'Fish', 'Eggs'],
  products: [
    P(1, 'Chicken', 'Chicken Curry Cut', '500 g', 130), P(2, 'Chicken', 'Chicken Boneless', '500 g', 220),
    P(3, 'Chicken', 'Chicken Biryani Cut', '1 kg', 250), P(4, 'Chicken', 'Chicken Wings', '500 g', 160),
    P(5, 'Chicken', 'Country Chicken', '1 kg', 420), P(6, 'Mutton', 'Mutton Curry Cut', '500 g', 390),
    P(7, 'Mutton', 'Mutton Boneless', '500 g', 480), P(8, 'Mutton', 'Mutton Liver', '250 g', 160),
    P(9, 'Fish', 'Seer Fish Slices', '500 g', 450), P(10, 'Fish', 'Rohu Fish', '500 g', 180),
    P(11, 'Fish', 'Prawns', '500 g', 380), P(12, 'Eggs', 'Egg Tray', '30 pcs', 210),
    P(13, 'Eggs', 'Country Eggs', '6 pcs', 66)
  ],
  orders: []
});
const save = d => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); };
let db; try { db = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { db = seed(); save(db); }
const STATUS = ['placed', 'accepted', 'packing', 'out_for_delivery', 'delivered', 'rejected'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
const readBody = req => new Promise(r => { let s = ''; req.on('data', c => { s += c; if (s.length > 1e5) req.destroy(); });
  req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch { r({}); } }); });
const clean = (s, n) => String(s ?? '').trim().slice(0, n);

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost'), p = u.pathname, m = req.method;
  if (p.startsWith('/api/')) {
    const admin = req.headers['x-admin-key'] === KEY;
    if (p === '/api/menu' && m === 'GET') return send(res, 200, { shop: db.shop, categories: db.categories, products: db.products });
    if (p === '/api/orders' && m === 'POST') {
      const b = await readBody(req), c = b.customer || {};
      const name = clean(c.name, 60), phone = clean(c.phone, 10), address = clean(c.address, 250);
      if (!name || !/^\d{10}$/.test(phone) || !address) return send(res, 400, { error: 'Name, 10-digit phone and address are required.' });
      if (!Array.isArray(b.items) || !b.items.length) return send(res, 400, { error: 'Cart is empty.' });
      const lines = [];
      for (const it of b.items) {
        const pr = db.products.find(x => x.id === it.id), q = Math.floor(+it.qty);
        if (!pr || !pr.inStock || !(q >= 1 && q <= 20)) return send(res, 400, { error: 'An item is unavailable. Please refresh.' });
        lines.push({ id: pr.id, name: pr.name, unit: pr.unit, price: pr.price, qty: q });
      }
      const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
      if (subtotal < db.shop.minOrder) return send(res, 400, { error: `Minimum order is Rs. ${db.shop.minOrder}.` });
      const now = new Date().toISOString();
      const order = { id: 'MM' + (1001 + db.orders.length), customer: { name, phone, address }, items: lines, subtotal,
        deliveryFee: db.shop.deliveryFee, total: subtotal + db.shop.deliveryFee,
        slot: db.shop.slots.includes(b.slot) ? b.slot : db.shop.slots[0], payment: ['UPI', 'Card', 'Cash'].includes(b.payment) ? b.payment : 'Cash',
        status: 'placed', createdAt: now, timeline: [{ status: 'placed', at: now }] };
      db.orders.push(order); save(db); return send(res, 201, order);
    }
    if (p === '/api/orders' && m === 'GET') {
      const ph = u.searchParams.get('phone') || '';
      if (!/^\d{10}$/.test(ph)) return send(res, 200, []);
      return send(res, 200, db.orders.filter(o => o.customer.phone === ph).reverse());
    }
    let mt = p.match(/^\/api\/orders\/(\w+)$/);
    if (mt && m === 'GET') {
      const o = db.orders.find(x => x.id === mt[1]);
      if (!o || o.customer.phone !== u.searchParams.get('phone')) return send(res, 404, { error: 'Order not found.' });
      return send(res, 200, o);
    }
    if (p.startsWith('/api/admin/') && !admin) return send(res, 401, { error: 'Wrong admin key.' });
    if (p === '/api/admin/orders' && m === 'GET') return send(res, 200, db.orders.slice().reverse());
    mt = p.match(/^\/api\/admin\/orders\/(\w+)$/);
    if (mt && m === 'PATCH') {
      const o = db.orders.find(x => x.id === mt[1]), b = await readBody(req);
      if (!o || !STATUS.includes(b.status)) return send(res, 400, { error: 'Bad request.' });
      o.status = b.status; o.timeline.push({ status: b.status, at: new Date().toISOString() }); save(db); return send(res, 200, o);
    }
    mt = p.match(/^\/api\/admin\/products\/(\d+)$/);
    if (mt && m === 'PATCH') {
      const pr = db.products.find(x => x.id === +mt[1]), b = await readBody(req);
      if (!pr) return send(res, 404, { error: 'Not found.' });
      if (b.price !== undefined && +b.price > 0) pr.price = Math.round(+b.price);
      if (typeof b.inStock === 'boolean') pr.inStock = b.inStock;
      save(db); return send(res, 200, pr);
    }
    return send(res, 404, { error: 'Not found.' });
  }
  const f = path.join(PUB, p === '/' ? 'index.html' : p === '/admin' ? 'admin.html' : p);
  if (!f.startsWith(PUB)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(d);
  });
}).listen(PORT, () => console.log(`\nFresh to Home running\n  Customer app: http://localhost:${PORT}\n  Shop admin:   http://localhost:${PORT}/admin  (key: ${KEY})\n`));

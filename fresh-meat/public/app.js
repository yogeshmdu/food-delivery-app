// Fresh to Home - customer app (vanilla JS, hash routes)
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rs = n => 'Rs. ' + n;
const S = { shop: null, cats: [], prods: [], cart: JSON.parse(localStorage.mm_cart || '{}'), user: JSON.parse(localStorage.mm_user || '{}'),
  q: '', form: {}, slot: null, pay: 'Cash', err: '', order: null, orders: null };
let timer = null;
const saveCart = () => localStorage.mm_cart = JSON.stringify(S.cart);
const items = () => Object.entries(S.cart).map(([id, q]) => ({ p: S.prods.find(x => x.id == id), q })).filter(x => x.p);
const sub = () => items().reduce((a, x) => a + x.p.price * x.q, 0);
const count = () => items().reduce((a, x) => a + x.q, 0);
const LABEL = { placed: 'Order placed', accepted: 'Accepted by shop', packing: 'Cutting and packing', out_for_delivery: 'Out for delivery', delivered: 'Delivered', rejected: 'Rejected by shop' };
const STEPS = [['placed', 'Placed'], ['accepted', 'Accepted'], ['packing', 'Packing'], ['out_for_delivery', 'On the way'], ['delivered', 'Delivered']];

const pcard = p => {
  const q = S.cart[p.id] || 0;
  const act = !p.inStock ? '<em>Sold out</em>' : q
    ? `<span class="qty"><button data-act="dec" data-id="${p.id}" aria-label="Remove one">-</button><i>${q}</i><button data-act="inc" data-id="${p.id}" aria-label="Add one">+</button></span>`
    : `<button class="plus" data-act="add" data-id="${p.id}" aria-label="Add ${esc(p.name)}">+</button>`;
  return `<div class="card"><div class="ph">Photo</div><b>${esc(p.name)}</b><small>${esc(p.unit)}</small><div class="row"><span class="pr">${rs(p.price)}</span>${act}</div></div>`;
};
const gridList = () => S.q ? S.prods.filter(p => p.name.toLowerCase().includes(S.q.toLowerCase())) : S.prods.slice(0, 8);
const gridHtml = l => l.length ? l.map(pcard).join('') : '<div class="empty" style="grid-column:1/3">No items found</div>';

const home = () => `<div class="hero"><div class="row"><div class="chip"><small>Delivering from</small><b>${esc(S.shop.name)}</b><small>${esc(S.shop.address)}</small></div>
<a class="call" href="tel:${S.shop.phone}" aria-label="Call shop">Call</a></div><h1>Fresh meat,<br><span>cut to order</span></h1>
<input id="q" class="search" placeholder="Search chicken, mutton, fish" value="${esc(S.q)}"></div>
<div class="pad"><div class="cats">${S.cats.map(c => `<a href="#/cat/${c}" class="cat"><div class="ph">Photo</div><span>${c}</span></a>`).join('')}</div>
<div class="sh"><b id="gt">${S.q ? 'Results' : 'Fresh today'}</b></div><div class="grid" id="grid">${gridHtml(gridList())}</div></div>`;

const cat = c => `<div class="top"><button class="back" data-act="back" aria-label="Back">&lt;</button><h2>${esc(c)}</h2></div>
<div class="split"><div class="rail">${S.cats.map(x => `<a href="#/cat/${x}" class="${x === c ? 'on' : ''}">${x}</a>`).join('')}</div>
<div class="grid">${gridHtml(S.prods.filter(p => p.cat === c))}</div></div>`;

const bill = () => { const s = sub(), f = S.shop.deliveryFee; return `<div class="box"><div class="bl"><span>Item total</span><span>${rs(s)}</span></div><div class="bl"><span>Delivery fee</span><span>${rs(f)}</span></div><div class="bl t"><span>To pay</span><span>${rs(s + f)}</span></div></div>`; };
const cartV = () => {
  if (!count()) return `<div class="big"><h2>My cart</h2><small>${esc(S.shop.name)}</small></div><div class="empty">Your cart is empty.<br><br><a class="cta" href="#/home">Browse fresh meat</a></div>`;
  return `<div class="big"><h2>My cart</h2><small>${esc(S.shop.name)}, Mattuthavani</small></div><div class="items">${items().map(({ p, q }) =>
    `<div class="line"><div class="ph">Photo</div><div class="m"><b>${esc(p.name)}</b><small>${esc(p.unit)}</small><span class="pr">${rs(p.price * q)}</span></div><span class="qty"><button data-act="dec" data-id="${p.id}" aria-label="Remove one">-</button><i>${q}</i><button data-act="inc" data-id="${p.id}" aria-label="Add one">+</button></span></div>`).join('')}
${bill()}<a class="cta" href="#/checkout">Checkout ${rs(sub() + S.shop.deliveryFee)}</a></div>`;
};
const fv = k => esc(S.form[k] ?? S.user[k] ?? '');
const checkout = () => {
  if (!count()) { location.hash = '#/cart'; return ''; }
  const slot = S.slot || S.shop.slots[0];
  return `<div class="top"><button class="back" data-act="back" aria-label="Back">&lt;</button><h2>Checkout</h2></div><div class="items f">
<div class="box"><b>1. Deliver to</b><label for="n">Name</label><input id="n" data-f="name" value="${fv('name')}" autocomplete="name">
<label for="p">Phone (10 digits)</label><input id="p" data-f="phone" value="${fv('phone')}" inputmode="numeric" maxlength="10" autocomplete="tel">
<label for="a">Address</label><input id="a" data-f="address" value="${fv('address')}" placeholder="Door no, street, area, Madurai"></div>
<div class="box"><b>2. Pick a slot</b><div class="pills" style="margin-top:8px">${S.shop.slots.map(s => `<button class="pill ${s === slot ? 'on' : ''}" data-act="pill" data-k="slot" data-v="${s}">${s}</button>`).join('')}</div></div>
<div class="box"><b>3. Pay with</b><div class="pills" style="margin-top:8px">${['UPI', 'Card', 'Cash'].map(s => `<button class="pill ${s === S.pay ? 'on' : ''}" data-act="pill" data-k="pay" data-v="${s}">${s}</button>`).join('')}</div>
<div class="note">Demo build: no real payment is taken. Pay the shop on delivery. Online payment (Razorpay) comes later.</div></div>
${S.err ? `<div class="err">${esc(S.err)}</div>` : ''}${bill()}<button class="cta" data-act="place">Place order</button></div>`;
};
async function place() {
  const g = k => (S.form[k] ?? S.user[k] ?? '').trim(), name = g('name'), phone = g('phone'), address = g('address');
  if (!name || !/^\d{10}$/.test(phone) || !address) { S.err = 'Enter your name, a 10-digit phone number and address.'; return render(); }
  if (sub() < S.shop.minOrder) { S.err = `Minimum order is ${rs(S.shop.minOrder)}.`; return render(); }
  try {
    const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer: { name, phone, address }, items: Object.entries(S.cart).map(([id, qty]) => ({ id: +id, qty })), slot: S.slot || S.shop.slots[0], payment: S.pay }) });
    const d = await r.json(); if (!r.ok) { S.err = d.error; return render(); }
    S.user = { name, phone, address }; localStorage.mm_user = JSON.stringify(S.user); S.cart = {}; saveCart(); S.err = ''; S.order = d; location.hash = '#/track/' + d.id;
  } catch { S.err = 'Cannot reach the server.'; render(); }
}
const track = id => {
  const o = S.order && S.order.id === id ? S.order : null;
  if (!o) return `<div class="empty">Loading order...</div>`;
  const idx = STEPS.findIndex(s => s[0] === o.status);
  return `<div class="top"><a class="back" href="#/orders" aria-label="Back" style="display:flex;align-items:center;justify-content:center">&lt;</a><h2>Track order</h2></div><div class="map">Live map (coming with the mobile app)</div>
<div class="sheet"><small>Order #${o.id} - ${esc(o.slot)}</small><h2>${LABEL[o.status]}</h2>
${o.status === 'rejected' ? '<div class="err">The shop could not accept this order. Please call the shop.</div>' : `<div class="steps">${STEPS.map((s, i) => `<div class="st ${i <= idx ? 'on' : ''}"><i></i>${s[1]}</div>`).join('')}</div>`}
<div class="shopc"><div><b>${esc(S.shop.name)}</b><br><small>${esc(S.shop.address)}</small><br><small>${S.shop.phone}</small></div><a class="c" href="tel:${S.shop.phone}">Call</a></div>
<p><b>${o.items.map(i => `${esc(i.name)} ${esc(i.unit)} x${i.qty}`).join(', ')}</b></p><p>Total ${rs(o.total)} - ${esc(o.payment)}</p></div>`;
};
const ordersV = () => {
  if (!S.user.phone) return `<div class="big"><h2>My orders</h2></div><div class="empty">Place an order to see it here.</div>`;
  if (!S.orders) return `<div class="big"><h2>My orders</h2></div><div class="empty">Loading...</div>`;
  return `<div class="big"><h2>My orders</h2></div><div class="items">${S.orders.length ? S.orders.map(o => `<a class="ord" href="#/track/${o.id}"><div class="row"><b>#${o.id}</b><span class="tag">${LABEL[o.status]}</span></div><small>${new Date(o.createdAt).toLocaleString()}</small><div>${o.items.map(i => esc(i.name)).join(', ')}</div><b>${rs(o.total)}</b></a>`).join('') : '<div class="empty">No orders yet.</div>'}</div>`;
};
const profile = () => `<div class="big"><h2>Profile</h2></div><div class="items f"><div class="box"><b>Your details</b><label for="n">Name</label><input id="n" data-f="name" value="${fv('name')}"><label for="p">Phone</label><input id="p" data-f="phone" value="${fv('phone')}" maxlength="10"><label for="a">Address</label><input id="a" data-f="address" value="${fv('address')}"><br><br><button class="cta" data-act="save">Save</button></div>
<div class="box"><b>${esc(S.shop.name)}</b><br>${esc(S.shop.address)}<br><a href="tel:${S.shop.phone}"><b>${S.shop.phone}</b></a></div></div>`;
const nav = v => { const on = k => (k === 'home' ? ['home', 'cat'] : [k]).includes(v) ? 'on' : '';
  return `<div class="nav"><a href="#/home" class="${on('home')}">Home</a><a href="#/orders" class="${on('orders') || (v === 'track' ? 'on' : '')}">Orders</a><a href="#/cart" class="${on('cart')}">Cart${count() ? ' ' + count() : ''}</a><a href="#/profile" class="${on('profile')}">Profile</a></div>`; };

async function load(url) { try { const r = await fetch(url); return r.ok ? r.json() : null; } catch { return null; } }
function render() {
  clearInterval(timer);
  const r = (location.hash || '#/home').slice(2).split('/'), v = r[0] || 'home';
  const views = { home, cat: () => cat(decodeURIComponent(r[1] || S.cats[0])), cart: cartV, checkout, track: () => track(r[1]), orders: ordersV, profile };
  const h = (views[v] || home)();
  const old = $('#scr'), y = old ? old.scrollTop : 0;
  const bar = (v === 'home' || v === 'cat') && count() ? `<a class="bar" href="#/cart"><span>${count()} items  ${rs(sub())}</span><span>View cart</span></a>` : '';
  $('#app').innerHTML = `<div class="scr" id="scr">${h}</div>${bar}${nav(v)}`;
  if ($('#scr') && old) $('#scr').scrollTop = y;
  if (v === 'track') { const go = async () => { const o = await load(`/api/orders/${r[1]}?phone=${S.user.phone || ''}`);
    if (o && JSON.stringify(o) !== JSON.stringify(S.order)) { S.order = o; const sc = $('#scr').scrollTop; $('#scr').innerHTML = track(r[1]); $('#scr').scrollTop = sc; } };
    go(); timer = setInterval(go, 4000); }
  if (v === 'orders' && S.user.phone) load('/api/orders?phone=' + S.user.phone).then(o => { if (o && location.hash.startsWith('#/orders')) { S.orders = o; $('#scr').innerHTML = ordersV(); } });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, id = b.dataset.id;
  if (a === 'add' || a === 'inc') S.cart[id] = Math.min(20, (S.cart[id] || 0) + 1);
  else if (a === 'dec') { S.cart[id] = (S.cart[id] || 0) - 1; if (S.cart[id] <= 0) delete S.cart[id]; }
  else if (a === 'pill') S[b.dataset.k] = b.dataset.v;
  else if (a === 'place') return place();
  else if (a === 'back') return history.back();
  else if (a === 'save') { const g = k => (S.form[k] ?? S.user[k] ?? '').trim(); S.user = { name: g('name'), phone: g('phone'), address: g('address') }; localStorage.mm_user = JSON.stringify(S.user); S.orders = null; }
  saveCart(); render();
});
document.addEventListener('input', e => {
  if (e.target.dataset.f) S.form[e.target.dataset.f] = e.target.value;
  if (e.target.id === 'q') { S.q = e.target.value; $('#grid').innerHTML = gridHtml(gridList()); $('#gt').textContent = S.q ? 'Results' : 'Fresh today'; }
});
window.addEventListener('hashchange', () => { S.err = ''; render(); $('#scr') && ($('#scr').scrollTop = 0); });
(async () => {
  const m = await load('/api/menu');
  if (!m) { $('#app').innerHTML = '<div class="empty">Cannot reach the server. Is it running?</div>'; return; }
  S.shop = m.shop; S.cats = m.categories; S.prods = m.products; render();
})();

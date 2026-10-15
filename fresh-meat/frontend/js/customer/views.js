// Reusable UI view components for customer application
import { escapeHtml, formatCurrency, formatDateTime } from '../common/formatters.js';

export const ORDER_STATUS_LABELS = {
  placed: 'Order placed',
  accepted: 'Accepted by shop',
  packing: 'Cutting and packing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  rejected: 'Rejected by shop'
};

export const ORDER_PROGRESS_STEPS = [
  ['placed', 'Placed'],
  ['accepted', 'Accepted'],
  ['packing', 'Packing'],
  ['out_for_delivery', 'On the way'],
  ['delivered', 'Delivered']
];

/**
 * Product card component
 */
export function renderProductCard(product, cartQty = 0) {
  let actionHtml;

  if (!product.inStock) {
    actionHtml = `<em>Sold out</em>`;
  } else if (cartQty > 0) {
    actionHtml = `
      <span class="qty">
        <button data-act="dec" data-id="${product.id}" aria-label="Decrease quantity">-</button>
        <i>${cartQty}</i>
        <button data-act="inc" data-id="${product.id}" aria-label="Increase quantity">+</button>
      </span>`;
  } else {
    actionHtml = `
      <button class="plus" data-act="add" data-id="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">+</button>`;
  }

  const imageHtml = product.image
    ? `<img src="${product.image}" class="card-img" alt="${escapeHtml(product.name)}" />`
    : `<div class="ph">${escapeHtml(product.cat)}</div>`;

  return `
    <div class="card">
      ${imageHtml}
      <b>${escapeHtml(product.name)}</b>
      <small>${escapeHtml(product.unit)}</small>
      <div class="row">
        <span class="pr">${formatCurrency(product.price)}</span>
        ${actionHtml}
      </div>
    </div>`;
}

/**
 * Product grid component
 */
export function renderProductsGrid(products, cart) {
  if (!products || products.length === 0) {
    return `<div class="empty" style="grid-column: 1 / 3;">No items found</div>`;
  }

  return products
    .map(product => renderProductCard(product, cart[product.id] || 0))
    .join('');
}

/**
 * Bill summary component
 */
export function renderBillSummary(subtotal, deliveryFee) {
  return `
    <div class="box">
      <div class="bl">
        <span>Item total</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="bl">
        <span>Delivery fee</span>
        <span>${formatCurrency(deliveryFee)}</span>
      </div>
      <div class="bl t">
        <span>To pay</span>
        <span>${formatCurrency(subtotal + deliveryFee)}</span>
      </div>
    </div>`;
}

/**
 * Home View
 */
export function renderHomeView(store) {
  const shop = store.shop || {};
  const query = store.searchQuery.toLowerCase().trim();

  const filteredProducts = query
    ? store.products.filter(p => p.name.toLowerCase().includes(query))
    : store.products.slice(0, 8);

  const gridTitle = query ? 'Results' : 'Fresh today';

  return `
    <div class="hero">
      <div class="row">
        <div class="chip">
          <small>Delivering from</small>
          <b>${escapeHtml(shop.name)}</b>
          <small>${escapeHtml(shop.address)}</small>
        </div>
        <a class="call" href="tel:${escapeHtml(shop.phone)}" aria-label="Call shop">Call</a>
      </div>
      <h1>Fresh meat,<br><span>cut to order</span></h1>
      <input id="q" class="search" placeholder="Search chicken, mutton, fish" value="${escapeHtml(store.searchQuery)}">
    </div>

    <div class="pad">
      <div class="cats">
        ${store.categories.map(category => {
          const imgUrl = (store.categoryImages && store.categoryImages[category]) || `/assets/images/categories/${category.toLowerCase()}.jpg`;
          return `
            <a href="#/cat/${encodeURIComponent(category)}" class="cat">
              <div class="cat-img-box"><img src="${imgUrl}" alt="${escapeHtml(category)}" /></div>
              <span>${escapeHtml(category)}</span>
            </a>
          `;
        }).join('')}
      </div>

      <div class="sh">
        <b id="gt">${gridTitle}</b>
      </div>

      <div class="grid" id="grid">
        ${renderProductsGrid(filteredProducts, store.cart)}
      </div>
    </div>`;
}

/**
 * Category View
 */
export function renderCategoryView(store, selectedCategory) {
  const categoryProducts = store.products.filter(p => p.cat === selectedCategory);

  return `
    <div class="top">
      <button class="back" data-act="back" aria-label="Go back">&lt;</button>
      <h2>${escapeHtml(selectedCategory)}</h2>
    </div>

    <div class="split">
      <div class="rail">
        ${store.categories.map(cat => `
          <a href="#/cat/${encodeURIComponent(cat)}" class="${cat === selectedCategory ? 'on' : ''}">${escapeHtml(cat)}</a>
        `).join('')}
      </div>

      <div class="grid">
        ${renderProductsGrid(categoryProducts, store.cart)}
      </div>
    </div>`;
}

/**
 * Cart View
 */
export function renderCartView(store) {
  const cartItems = store.getCartItems();
  const shop = store.shop || {};

  if (cartItems.length === 0) {
    return `
      <div class="big">
        <h2>My cart</h2>
        <small>${escapeHtml(shop.name)}</small>
      </div>
      <div class="empty">
        Your cart is empty.<br><br>
        <a class="cta" href="#/home">Browse fresh meat</a>
      </div>`;
  }

  const subtotal = store.getCartSubtotal();
  const deliveryFee = shop.deliveryFee || 0;

  return `
    <div class="big">
      <h2>My cart</h2>
      <small>${escapeHtml(shop.name)}, ${escapeHtml(shop.address)}</small>
    </div>

    <div class="items">
      ${cartItems.map(({ product, qty }) => `
        <div class="line">
          ${product.image
            ? `<div class="line-img-box"><img src="${product.image}" alt="${escapeHtml(product.name)}" /></div>`
            : `<div class="ph">${escapeHtml(product.cat)}</div>`}
          <div class="m">
            <b>${escapeHtml(product.name)}</b>
            <small>${escapeHtml(product.unit)}</small>
            <span class="pr">${formatCurrency(product.price * qty)}</span>
          </div>
          <span class="qty">
            <button data-act="dec" data-id="${product.id}" aria-label="Decrease quantity">-</button>
            <i>${qty}</i>
            <button data-act="inc" data-id="${product.id}" aria-label="Increase quantity">+</button>
          </span>
        </div>
      `).join('')}

      ${renderBillSummary(subtotal, deliveryFee)}

      <a class="cta" href="#/checkout">Checkout ${formatCurrency(subtotal + deliveryFee)}</a>
    </div>`;
}

/**
 * Checkout View
 */
export function renderCheckoutView(store) {
  const cartCount = store.getCartTotalCount();
  if (cartCount === 0) {
    location.hash = '#/cart';
    return '';
  }

  const shop = store.shop || { slots: ['7 - 9 AM'] };
  const currentSlot = store.selectedSlot || shop.slots[0];
  const paymentOptions = ['UPI', 'Card', 'Cash'];

  const subtotal = store.getCartSubtotal();
  const deliveryFee = shop.deliveryFee || 0;

  return `
    <div class="top">
      <button class="back" data-act="back" aria-label="Go back">&lt;</button>
      <h2>Checkout</h2>
    </div>

    <div class="items f">
      <div class="box">
        <b>1. Deliver to</b>
        <label for="n">Name</label>
        <input id="n" data-f="name" value="${escapeHtml(store.getFormValue('name'))}" autocomplete="name" placeholder="Enter your full name">

        <label for="p">Phone (10 digits)</label>
        <input id="p" data-f="phone" value="${escapeHtml(store.getFormValue('phone'))}" inputmode="numeric" maxlength="10" autocomplete="tel" placeholder="10-digit mobile number">

        <label for="a">Address</label>
        <input id="a" data-f="address" value="${escapeHtml(store.getFormValue('address'))}" placeholder="Door no, street, area, Madurai">
      </div>

      <div class="box">
        <b>2. Pick a slot</b>
        <div class="pills" style="margin-top: 8px;">
          ${shop.slots.map(slot => `
            <button class="pill ${slot === currentSlot ? 'on' : ''}" data-act="pill" data-k="slot" data-v="${escapeHtml(slot)}">${escapeHtml(slot)}</button>
          `).join('')}
        </div>
      </div>

      <div class="box">
        <b>3. Pay with</b>
        <div class="pills" style="margin-top: 8px;">
          ${paymentOptions.map(method => `
            <button class="pill ${method === store.paymentMethod ? 'on' : ''}" data-act="pill" data-k="pay" data-v="${escapeHtml(method)}">${escapeHtml(method)}</button>
          `).join('')}
        </div>
        <div class="note">Pay cash or scan UPI directly to the delivery person on doorstep delivery.</div>
      </div>

      ${store.errorMessage ? `<div class="err">${escapeHtml(store.errorMessage)}</div>` : ''}

      ${renderBillSummary(subtotal, deliveryFee)}

      <button class="cta" data-act="place">Place order</button>
    </div>`;
}

/**
 * Order Tracking View
 */
export function renderTrackView(store, orderId) {
  const order = store.activeOrder && store.activeOrder.id === orderId ? store.activeOrder : null;
  const shop = store.shop || {};

  if (!order) {
    return `<div class="empty">Loading order #${escapeHtml(orderId)}...</div>`;
  }

  const currentStepIndex = ORDER_PROGRESS_STEPS.findIndex(([status]) => status === order.status);
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  return `
    <div class="top">
      <a class="back" href="#/orders" aria-label="Back to orders" style="display:flex;align-items:center;justify-content:center;">&lt;</a>
      <h2>Track order</h2>
    </div>

    <div class="map">Live map tracking</div>

    <div class="sheet">
      <small>Order #${escapeHtml(order.id)} - ${escapeHtml(order.slot)}</small>
      <h2>${escapeHtml(statusLabel)}</h2>

      ${order.status === 'rejected'
        ? `<div class="err">The shop could not accept this order. Please call the shop for assistance.</div>`
        : `
          <div class="steps">
            ${ORDER_PROGRESS_STEPS.map(([stepKey, stepLabel], index) => `
              <div class="st ${index <= currentStepIndex ? 'on' : ''}">
                <i></i>
                ${escapeHtml(stepLabel)}
              </div>
            `).join('')}
          </div>
        `}

      <div class="shopc">
        <div>
          <b>${escapeHtml(shop.name)}</b><br>
          <small>${escapeHtml(shop.address)}</small><br>
          <small>${escapeHtml(shop.phone)}</small>
        </div>
        <a class="c" href="tel:${escapeHtml(shop.phone)}">Call</a>
      </div>

      <p><b>${order.items.map(item => `${escapeHtml(item.name)} ${escapeHtml(item.unit)} x${item.qty}`).join(', ')}</b></p>
      <p>Total ${formatCurrency(order.total)} - ${escapeHtml(order.payment)}</p>
    </div>`;
}

/**
 * Order History View
 */
export function renderOrdersView(store) {
  if (!store.user.phone) {
    return `
      <div class="big"><h2>My orders</h2></div>
      <div class="empty">Enter your mobile number during checkout to view your order history here.</div>`;
  }

  if (!store.ordersList) {
    return `
      <div class="big"><h2>My orders</h2></div>
      <div class="empty">Loading orders...</div>`;
  }

  return `
    <div class="big"><h2>My orders</h2></div>
    <div class="items">
      ${store.ordersList.length > 0
        ? store.ordersList.map(order => `
          <a class="ord" href="#/track/${encodeURIComponent(order.id)}">
            <div class="row">
              <b>#${escapeHtml(order.id)}</b>
              <span class="tag">${escapeHtml(ORDER_STATUS_LABELS[order.status] || order.status)}</span>
            </div>
            <small>${formatDateTime(order.createdAt)}</small>
            <div>${order.items.map(i => escapeHtml(i.name)).join(', ')}</div>
            <b>${formatCurrency(order.total)}</b>
          </a>
        `).join('')
        : `<div class="empty">No past orders found.</div>`
      }
    </div>`;
}

/**
 * Customer Profile View
 */
export function renderProfileView(store) {
  const shop = store.shop || {};

  return `
    <div class="big"><h2>Profile</h2></div>
    <div class="items f">
      <div class="box">
        <b>Your details</b>
        <label for="n">Name</label>
        <input id="n" data-f="name" value="${escapeHtml(store.getFormValue('name'))}" placeholder="Full name">

        <label for="p">Phone</label>
        <input id="p" data-f="phone" value="${escapeHtml(store.getFormValue('phone'))}" maxlength="10" placeholder="10-digit phone number">

        <label for="a">Address</label>
        <input id="a" data-f="address" value="${escapeHtml(store.getFormValue('address'))}" placeholder="Delivery address">
        <br><br>
        <button class="cta" data-act="save">Save Profile</button>
      </div>

      <div class="box">
        <b>${escapeHtml(shop.name)}</b><br>
        <small>${escapeHtml(shop.address)}</small><br>
        <a href="tel:${escapeHtml(shop.phone)}"><b>${escapeHtml(shop.phone)}</b></a>
      </div>
    </div>`;
}

/**
 * Bottom Navigation Component
 */
export function renderBottomNav(currentRoute, cartCount) {
  const isTabActive = (tab) => {
    if (tab === 'home') return currentRoute === 'home' || currentRoute === 'cat';
    if (tab === 'orders') return currentRoute === 'orders' || currentRoute === 'track';
    return currentRoute === tab;
  };

  return `
    <div class="nav">
      <a href="#/home" class="${isTabActive('home') ? 'on' : ''}">Home</a>
      <a href="#/orders" class="${isTabActive('orders') ? 'on' : ''}">Orders</a>
      <a href="#/cart" class="${isTabActive('cart') ? 'on' : ''}">Cart${cartCount > 0 ? ` ${cartCount}` : ''}</a>
      <a href="#/profile" class="${isTabActive('profile') ? 'on' : ''}">Profile</a>
    </div>`;
}

/**
 * Floating Cart Summary Bar
 */
export function renderFloatingCartBar(cartCount, subtotal) {
  return `
    <a class="bar" href="#/cart">
      <span>${cartCount} ${cartCount === 1 ? 'item' : 'items'} &bull; ${formatCurrency(subtotal)}</span>
      <span>View cart &rarr;</span>
    </a>`;
}

// Customer application main entry point
import { fetchMenu, createOrder, fetchOrdersByPhone, fetchOrderById } from './api.js';
import { store } from './state.js';
import {
  renderHomeView,
  renderCategoryView,
  renderCartView,
  renderCheckoutView,
  renderTrackView,
  renderOrdersView,
  renderProfileView,
  renderBottomNav,
  renderFloatingCartBar,
  renderProductsGrid
} from './views.js';
import { formatCurrency } from '../common/formatters.js';

let trackingIntervalTimer = null;

function getRootElement() {
  return document.getElementById('app');
}

/**
 * Main application renderer based on URL hash
 */
export function renderApp() {
  clearInterval(trackingIntervalTimer);

  const hash = location.hash || '#/home';
  const pathParts = hash.slice(2).split('/');
  const route = pathParts[0] || 'home';
  const routeParam = pathParts[1] ? decodeURIComponent(pathParts[1]) : '';

  let viewHtml = '';

  switch (route) {
    case 'home':
      viewHtml = renderHomeView(store);
      break;

    case 'cat':
      viewHtml = renderCategoryView(store, routeParam || store.categories[0] || '');
      break;

    case 'cart':
      viewHtml = renderCartView(store);
      break;

    case 'checkout':
      viewHtml = renderCheckoutView(store);
      break;

    case 'track':
      viewHtml = renderTrackView(store, routeParam);
      break;

    case 'orders':
      viewHtml = renderOrdersView(store);
      break;

    case 'profile':
      viewHtml = renderProfileView(store);
      break;

    default:
      viewHtml = renderHomeView(store);
      break;
  }

  const scrollContainer = document.getElementById('scr');
  const previousScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

  const cartCount = store.getCartTotalCount();
  const cartSubtotal = store.getCartSubtotal();
  const showFloatingCart = (route === 'home' || route === 'cat') && cartCount > 0;

  const floatingCartHtml = showFloatingCart ? renderFloatingCartBar(cartCount, cartSubtotal) : '';
  const bottomNavHtml = renderBottomNav(route, cartCount);

  getRootElement().innerHTML = `
    <div class="scr" id="scr">${viewHtml}</div>
    ${floatingCartHtml}
    ${bottomNavHtml}
  `;

  // Preserve scroll position if available
  const newScrollContainer = document.getElementById('scr');
  if (newScrollContainer && previousScrollTop > 0) {
    newScrollContainer.scrollTop = previousScrollTop;
  }

  // Live polling for tracking screen
  if (route === 'track' && routeParam) {
    const pollOrder = async () => {
      const updatedOrder = await fetchOrderById(routeParam, store.user.phone);
      if (updatedOrder && JSON.stringify(updatedOrder) !== JSON.stringify(store.activeOrder)) {
        store.activeOrder = updatedOrder;
        const currentScroll = newScrollContainer ? newScrollContainer.scrollTop : 0;
        newScrollContainer.innerHTML = renderTrackView(store, routeParam);
        newScrollContainer.scrollTop = currentScroll;
      }
    };

    pollOrder();
    trackingIntervalTimer = setInterval(pollOrder, 4000);
  }

  // Load orders list if navigating to orders view
  if (route === 'orders' && store.user.phone && !store.ordersList) {
    fetchOrdersByPhone(store.user.phone).then((orders) => {
      store.ordersList = orders;
      if (location.hash.startsWith('#/orders')) {
        const scroller = document.getElementById('scr');
        if (scroller) scroller.innerHTML = renderOrdersView(store);
      }
    });
  }
}

/**
 * Handle order placement from checkout form
 */
async function handlePlaceOrder() {
  const name = store.getFormValue('name').trim();
  const phone = store.getFormValue('phone').trim();
  const address = store.getFormValue('address').trim();

  if (!name || !/^\d{10}$/.test(phone) || !address) {
    store.errorMessage = 'Enter your name, a 10-digit phone number and address.';
    return renderApp();
  }

  const subtotal = store.getCartSubtotal();
  const shop = store.shop || {};
  if (subtotal < (shop.minOrder || 0)) {
    store.errorMessage = `Minimum order is ${formatCurrency(shop.minOrder)}.`;
    return renderApp();
  }

  const items = Object.entries(store.cart).map(([id, qty]) => ({
    id: Number(id),
    qty
  }));

  try {
    const newOrder = await createOrder({
      customer: { name, phone, address },
      items,
      slot: store.selectedSlot || (shop.slots ? shop.slots[0] : ''),
      payment: store.paymentMethod
    });

    store.saveUserProfile({ name, phone, address });
    store.clearCart();
    store.errorMessage = '';
    store.activeOrder = newOrder;
    location.hash = `#/track/${newOrder.id}`;
  } catch (err) {
    store.errorMessage = err.message || 'Cannot reach the server.';
    renderApp();
  }
}

// Global click event delegation
document.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-act]');
  if (!actionButton) return;

  const action = actionButton.dataset.act;
  const targetId = actionButton.dataset.id;

  switch (action) {
    case 'add':
    case 'inc':
      store.addToCart(targetId);
      break;

    case 'dec':
      store.decrementCart(targetId);
      break;

    case 'pill':
      const key = actionButton.dataset.k;
      const val = actionButton.dataset.v;
      if (key === 'slot') store.selectedSlot = val;
      if (key === 'pay') store.paymentMethod = val;
      break;

    case 'place':
      return handlePlaceOrder();

    case 'back':
      return history.back();

    case 'save':
      store.saveUserProfile({
        name: store.getFormValue('name'),
        phone: store.getFormValue('phone'),
        address: store.getFormValue('address')
      });
      alert('Profile saved!');
      break;

    default:
      break;
  }

  renderApp();
});

// Input event delegation for search and forms
document.addEventListener('input', (event) => {
  const target = event.target;

  if (target.dataset.f) {
    store.setFormValue(target.dataset.f, target.value);
  }

  if (target.id === 'q') {
    store.searchQuery = target.value;
    const gridEl = document.getElementById('grid');
    const titleEl = document.getElementById('gt');

    const query = store.searchQuery.toLowerCase().trim();
    const filtered = query
      ? store.products.filter(p => p.name.toLowerCase().includes(query))
      : store.products.slice(0, 8);

    if (gridEl) gridEl.innerHTML = renderProductsGrid(filtered, store.cart);
    if (titleEl) titleEl.textContent = query ? 'Results' : 'Fresh today';
  }
});

// Hash change router listener
window.addEventListener('hashchange', () => {
  store.errorMessage = '';
  renderApp();
  const scroller = document.getElementById('scr');
  if (scroller) scroller.scrollTop = 0;
});

// App Bootstrap
(async function init() {
  const menuData = await fetchMenu();
  if (!menuData) {
    getRootElement().innerHTML = `
      <div class="empty">
        <h3>Cannot connect to server</h3>
        <p>Please check your connection and ensure the server is running.</p>
      </div>`;
    return;
  }

  store.shop = menuData.shop;
  store.categories = menuData.categories;
  store.categoryImages = menuData.categoryImages || {};
  store.products = menuData.products;

  renderApp();
})();

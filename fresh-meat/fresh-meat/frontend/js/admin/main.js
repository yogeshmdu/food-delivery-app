// Shop admin dashboard entry and controller
import { fetchAdminOrders, updateOrderStatus, updateProduct, fetchAdminMenu } from './api.js';
import { renderLoginView, renderKanbanBoard, renderProductsTable } from './views.js';
import { playNotificationBeep } from '../common/audio.js';

let adminKey = localStorage.getItem('mm_key') || '';
let currentTab = 1; // 1: Live orders, 2: Products
let orders = [];
let products = [];
let previousNewOrdersCount = -1;

function getMainContainer() {
  return document.getElementById('m');
}

function getCountBadge() {
  return document.getElementById('cnt');
}

/**
 * Renders login form
 * @param {string} errorMsg 
 */
function showLogin(errorMsg = '') {
  getMainContainer().innerHTML = renderLoginView(errorMsg);
  const submitBtn = document.getElementById('go');
  const keyInput = document.getElementById('k');

  if (submitBtn && keyInput) {
    const handleLogin = () => {
      adminKey = keyInput.value.trim();
      localStorage.setItem('mm_key', adminKey);
      refreshData();
    };

    submitBtn.onclick = handleLogin;
    keyInput.onkeydown = (e) => {
      if (e.key === 'Enter') handleLogin();
    };
  }
}

/**
 * Draws the current tab content
 */
function drawContent() {
  const container = getMainContainer();

  if (currentTab === 1) {
    container.innerHTML = renderKanbanBoard(orders);

    // Attach order status action handlers
    container.querySelectorAll('button[data-i]').forEach(button => {
      button.onclick = async () => {
        const orderId = button.dataset.i;
        const newStatus = button.dataset.s;
        button.disabled = true;

        try {
          await updateOrderStatus(orderId, newStatus, adminKey);
          await refreshData();
        } catch (err) {
          alert('Failed to update order status');
          button.disabled = false;
        }
      };
    });
  } else {
    container.innerHTML = renderProductsTable(products);

    // Attach price change handlers
    container.querySelectorAll('input[data-p]').forEach(input => {
      input.onchange = async () => {
        const productId = input.dataset.p;
        const newPrice = input.value;
        try {
          await updateProduct(productId, { price: newPrice }, adminKey);
        } catch {
          alert('Failed to update product price');
        }
      };
    });

    // Attach stock toggle handlers
    container.querySelectorAll('input[data-s]').forEach(input => {
      input.onchange = async () => {
        const productId = input.dataset.s;
        const inStock = input.checked;
        try {
          await updateProduct(productId, { inStock }, adminKey);
        } catch {
          alert('Failed to update stock status');
        }
      };
    });
  }
}

/**
 * Fetches latest orders and menu data
 */
async function refreshData() {
  try {
    orders = await fetchAdminOrders(adminKey);
    const menu = await fetchAdminMenu();
    products = menu.products || [];

    const newOrdersCount = orders.filter(o => o.status === 'placed').length;

    // Trigger audio beep on new orders
    if (previousNewOrdersCount >= 0 && newOrdersCount > previousNewOrdersCount) {
      playNotificationBeep();
    }
    previousNewOrdersCount = newOrdersCount;

    const countBadge = getCountBadge();
    if (countBadge) {
      countBadge.textContent = `${newOrdersCount} new order${newOrdersCount === 1 ? '' : 's'}`;
    }

    drawContent();
  } catch (err) {
    if (err.message === 'UNAUTHORIZED') {
      showLogin(adminKey ? 'Invalid admin key. Please try again.' : '');
    } else {
      console.error('Error refreshing admin data:', err);
    }
  }
}

// Tab navigation buttons
const tab1Btn = document.getElementById('t1');
const tab2Btn = document.getElementById('t2');

if (tab1Btn && tab2Btn) {
  tab1Btn.onclick = () => {
    currentTab = 1;
    tab1Btn.className = 'on';
    tab2Btn.className = '';
    refreshData();
  };

  tab2Btn.onclick = () => {
    currentTab = 2;
    tab2Btn.className = 'on';
    tab1Btn.className = '';
    drawContent();
  };
}

// Initial fetch
refreshData();

// Polling interval every 4 seconds for live incoming orders
setInterval(() => {
  const isLoginFormOpen = document.querySelector('.login');
  if (adminKey && currentTab === 1 && !isLoginFormOpen) {
    refreshData();
  }
}, 4000);

// Shop admin API client service

function createAdminHeaders(adminKey) {
  return {
    'Content-Type': 'application/json',
    'x-admin-key': adminKey
  };
}

/**
 * Loads all orders for admin review
 * @param {string} adminKey 
 */
export async function fetchAdminOrders(adminKey) {
  const res = await fetch('/api/admin/orders', {
    headers: createAdminHeaders(adminKey)
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  if (!res.ok) {
    throw new Error('Failed to fetch admin orders');
  }

  return await res.json();
}

/**
 * Updates status of an order
 * @param {string} orderId 
 * @param {string} status 
 * @param {string} adminKey 
 */
export async function updateOrderStatus(orderId, status, adminKey) {
  const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: createAdminHeaders(adminKey),
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error('Failed to update order status');
  }

  return await res.json();
}

/**
 * Updates price or stock of a product
 * @param {number|string} productId 
 * @param {{ price?: number, inStock?: boolean }} updates 
 * @param {string} adminKey 
 */
export async function updateProduct(productId, updates, adminKey) {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    headers: createAdminHeaders(adminKey),
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    throw new Error('Failed to update product');
  }

  return await res.json();
}

/**
 * Fetches menu to display product catalog in admin
 */
export async function fetchAdminMenu() {
  const res = await fetch('/api/menu');
  if (!res.ok) {
    throw new Error('Failed to load menu');
  }
  return await res.json();
}

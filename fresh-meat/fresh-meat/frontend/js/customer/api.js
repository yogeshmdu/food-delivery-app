// Customer API client service

/**
 * Loads menu details including shop information, categories, and products
 */
export async function fetchMenu() {
  try {
    const res = await fetch('/api/menu');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch menu:', err);
    return null;
  }
}

/**
 * Places a new order
 * @param {object} orderData 
 */
export async function createOrder(orderData) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to place order');
  }
  return data;
}

/**
 * Fetches previous orders for a given customer phone number
 * @param {string} phone 
 */
export async function fetchOrdersByPhone(phone) {
  if (!phone) return [];
  try {
    const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return [];
  }
}

/**
 * Fetches order details for tracking
 * @param {string} orderId 
 * @param {string} phone 
 */
export async function fetchOrderById(orderId, phone) {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phone || '')}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch order #${orderId}:`, err);
    return null;
  }
}

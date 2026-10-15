// Mobile API client with multi-environment host resolution
import { Platform } from 'react-native';

// Default host: 10.0.2.2 for Android Emulator, localhost for iOS simulator
let apiBaseUrl = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000'
});

export function setApiBaseUrl(url) {
  if (url) {
    apiBaseUrl = url.replace(/\/+$/, '');
  }
}

export function getApiBaseUrl() {
  return apiBaseUrl;
}

/**
 * Fetch menu catalog
 */
export async function getMenu() {
  const res = await fetch(`${apiBaseUrl}/api/menu`);
  if (!res.ok) throw new Error('Failed to load menu');
  return await res.json();
}

/**
 * Place a new order
 */
export async function createOrder(payload) {
  const res = await fetch(`${apiBaseUrl}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to place order');
  }
  return data;
}

/**
 * Get past customer orders by phone number
 */
export async function getOrdersByPhone(phone) {
  if (!phone) return [];
  const res = await fetch(`${apiBaseUrl}/api/orders?phone=${encodeURIComponent(phone)}`);
  if (!res.ok) return [];
  return await res.json();
}

/**
 * Get order tracking details by order ID
 */
export async function getOrderById(orderId, phone) {
  const res = await fetch(`${apiBaseUrl}/api/orders/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phone || '')}`);
  if (!res.ok) return null;
  return await res.json();
}

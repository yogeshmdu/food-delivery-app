// Customer state store with localStorage synchronization

function loadStorageJson(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorageJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

class CustomerStore {
  constructor() {
    this.shop = null;
    this.categories = [];
    this.products = [];

    this.cart = loadStorageJson('mm_cart', {});
    this.user = loadStorageJson('mm_user', {});

    this.searchQuery = '';
    this.formData = {};
    this.selectedSlot = null;
    this.paymentMethod = 'Cash';
    this.errorMessage = '';

    this.activeOrder = null;
    this.ordersList = null;
  }

  // Cart operations
  getCartItems() {
    return Object.entries(this.cart)
      .map(([id, qty]) => {
        const product = this.products.find(p => String(p.id) === String(id));
        return product ? { product, qty } : null;
      })
      .filter(Boolean);
  }

  getCartSubtotal() {
    return this.getCartItems().reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }

  getCartTotalCount() {
    return this.getCartItems().reduce((sum, item) => sum + item.qty, 0);
  }

  addToCart(productId) {
    const current = this.cart[productId] || 0;
    this.cart[productId] = Math.min(20, current + 1);
    this.persistCart();
  }

  decrementCart(productId) {
    const current = this.cart[productId] || 0;
    if (current <= 1) {
      delete this.cart[productId];
    } else {
      this.cart[productId] = current - 1;
    }
    this.persistCart();
  }

  clearCart() {
    this.cart = {};
    this.persistCart();
  }

  persistCart() {
    saveStorageJson('mm_cart', this.cart);
  }

  // User profile operations
  saveUserProfile(profile) {
    this.user = {
      name: String(profile.name || '').trim(),
      phone: String(profile.phone || '').trim(),
      address: String(profile.address || '').trim()
    };
    saveStorageJson('mm_user', this.user);
    this.ordersList = null;
  }

  getFormValue(field) {
    return this.formData[field] ?? this.user[field] ?? '';
  }

  setFormValue(field, value) {
    this.formData[field] = value;
  }
}

export const store = new CustomerStore();

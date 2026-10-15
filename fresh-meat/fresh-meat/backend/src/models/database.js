// Database model with persistent JSON file storage
const fs = require('fs');
const path = require('path');
const { DB_FILE, ORDER_STATUSES, PAYMENT_METHODS } = require('../config');

/**
 * Creates default seed data for the shop
 */
function createSeedData() {
  const createProduct = (id, cat, name, unit, price, image) => ({
    id,
    cat,
    name,
    unit,
    price,
    inStock: true,
    image
  });

  return {
    shop: {
      name: 'Madurai Mertal Meats',
      address: '120/2 Mattuthavani, Bus stand opposite',
      phone: '8098621639',
      deliveryFee: 30,
      minOrder: 150,
      slots: ['7 - 9 AM', '9 - 11 AM', '4 - 6 PM', '6 - 8 PM']
    },
    categories: ['Chicken', 'Mutton', 'Fish', 'Eggs'],
    categoryImages: {
      'Chicken': '/assets/images/categories/chicken.jpg',
      'Mutton': '/assets/images/categories/mutton.jpg',
      'Fish': '/assets/images/categories/fish.jpg',
      'Eggs': '/assets/images/categories/eggs.jpg'
    },
    products: [
      createProduct(1, 'Chicken', 'Chicken Curry Cut', '500 g', 130, '/assets/images/products/chicken_curry_cut.jpg'),
      createProduct(2, 'Chicken', 'Chicken Boneless', '500 g', 220, '/assets/images/products/chicken_boneless.jpg'),
      createProduct(3, 'Chicken', 'Chicken Biryani Cut', '1 kg', 250, '/assets/images/products/chicken_biryani_cut.jpg'),
      createProduct(4, 'Chicken', 'Chicken Wings', '500 g', 160, '/assets/images/products/chicken_wings.jpg'),
      createProduct(5, 'Chicken', 'Country Chicken', '1 kg', 420, '/assets/images/products/country_chicken.jpg'),
      createProduct(6, 'Mutton', 'Mutton Curry Cut', '500 g', 390, '/assets/images/products/mutton_curry_cut.jpg'),
      createProduct(7, 'Mutton', 'Mutton Boneless', '500 g', 480, '/assets/images/products/mutton_boneless.jpg'),
      createProduct(8, 'Mutton', 'Mutton Liver', '250 g', 160, '/assets/images/products/mutton_liver.jpg'),
      createProduct(9, 'Fish', 'Seer Fish Slices', '500 g', 450, '/assets/images/products/seer_fish_slices.jpg'),
      createProduct(10, 'Fish', 'Rohu Fish', '500 g', 180, '/assets/images/products/rohu_fish.jpg'),
      createProduct(11, 'Fish', 'Prawns', '500 g', 380, '/assets/images/products/prawns.jpg'),
      createProduct(12, 'Eggs', 'Egg Tray', '30 pcs', 210, '/assets/images/products/egg_tray.jpg'),
      createProduct(13, 'Eggs', 'Country Eggs', '6 pcs', 66, '/assets/images/products/country_eggs.jpg')
    ],
    orders: []
  };
}

class Database {
  constructor() {
    this.filePath = DB_FILE;
    this.data = this.load();
  }

  /**
   * Load data from file or initialize with seed
   */
  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Could not read existing database, initializing with default seed.', err.message);
    }

    const defaultData = createSeedData();
    this.save(defaultData);
    return defaultData;
  }

  /**
   * Save data atomically to file
   */
  save(dataToSave = this.data) {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write database file:', err.message);
    }
  }

  // --- Menu / Shop queries ---

  getMenu() {
    return {
      shop: this.data.shop,
      categories: this.data.categories,
      categoryImages: this.data.categoryImages || {
        'Chicken': '/assets/images/categories/chicken.jpg',
        'Mutton': '/assets/images/categories/mutton.jpg',
        'Fish': '/assets/images/categories/fish.jpg',
        'Eggs': '/assets/images/categories/eggs.jpg'
      },
      products: this.data.products
    };
  }

  getShop() {
    return this.data.shop;
  }

  getCategories() {
    return this.data.categories;
  }

  getProducts() {
    return this.data.products;
  }

  getProductById(id) {
    return this.data.products.find(item => item.id === Number(id));
  }

  updateProduct(id, updates) {
    const product = this.getProductById(id);
    if (!product) return null;

    if (updates.price !== undefined) {
      const priceNum = Number(updates.price);
      if (!Number.isNaN(priceNum) && priceNum > 0) {
        product.price = Math.round(priceNum);
      }
    }

    if (typeof updates.inStock === 'boolean') {
      product.inStock = updates.inStock;
    }

    this.save();
    return product;
  }

  // --- Orders queries ---

  getAllOrdersReversed() {
    return this.data.orders.slice().reverse();
  }

  getOrdersByPhone(phone) {
    return this.data.orders
      .filter(order => order.customer && order.customer.phone === phone)
      .slice()
      .reverse();
  }

  getOrderById(id) {
    return this.data.orders.find(order => order.id === id);
  }

  createOrder({ customer, items, slot, payment }) {
    const now = new Date().toISOString();
    const orderId = 'MM' + (1001 + this.data.orders.length);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const deliveryFee = this.data.shop.deliveryFee || 0;
    const total = subtotal + deliveryFee;

    const selectedSlot = this.data.shop.slots.includes(slot)
      ? slot
      : this.data.shop.slots[0];

    const selectedPayment = PAYMENT_METHODS.includes(payment)
      ? payment
      : 'Cash';

    const order = {
      id: orderId,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      },
      items,
      subtotal,
      deliveryFee,
      total,
      slot: selectedSlot,
      payment: selectedPayment,
      status: 'placed',
      createdAt: now,
      timeline: [
        { status: 'placed', at: now }
      ]
    };

    this.data.orders.push(order);
    this.save();
    return order;
  }

  updateOrderStatus(orderId, newStatus) {
    if (!ORDER_STATUSES.includes(newStatus)) {
      return null;
    }

    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = newStatus;
    order.timeline.push({
      status: newStatus,
      at: new Date().toISOString()
    });

    this.save();
    return order;
  }
}

// Singleton database instance
const dbInstance = new Database();

module.exports = dbInstance;

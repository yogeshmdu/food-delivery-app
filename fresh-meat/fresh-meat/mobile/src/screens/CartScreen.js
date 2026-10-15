// Cart Screen Component
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BillSummary from '../components/BillSummary';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function CartScreen({ onNavigate }) {
  const { shop, getCartItems, getCartSubtotal, addToCart, decrementCart } = useApp();
  const cartItems = getCartItems();
  const subtotal = getCartSubtotal();
  const deliveryFee = shop?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="My Cart" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Explore our fresh cuts and order online today.</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => onNavigate('home')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseText}>Browse Fresh Meat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="My Cart"
        subtitle={`${shop?.name || 'Fresh to Home'}, Mattuthavani`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cart Item Cards */}
        {cartItems.map(({ product, qty }) => (
          <View key={product.id} style={styles.itemCard}>
            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText}>{product.cat}</Text>
            </View>

            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.itemUnit}>{product.unit}</Text>
              <Text style={styles.itemPrice}>Rs. {product.price * qty}</Text>
            </View>

            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => decrementCart(product.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepQty}>{qty}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => addToCart(product.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Bill Summary */}
        <BillSummary subtotal={subtotal} deliveryFee={deliveryFee} />

        {/* Checkout Button */}
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => onNavigate('checkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout • Rs. {total}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120
  },
  itemCard: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.card
  },
  itemBadge: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  itemBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain
  },
  itemUnit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 4
  },
  stepBtn: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  stepQty: {
    minWidth: 16,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.floating
  },
  checkoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 28
  },
  browseText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textInverse
  }
});

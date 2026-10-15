// Checkout Screen Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BillSummary from '../components/BillSummary';
import { createOrder } from '../api/client';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function CheckoutScreen({ onNavigate }) {
  const { shop, cart, user, saveUserProfile, clearCart, getCartItems, getCartSubtotal, setActiveOrder } = useApp();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [selectedSlot, setSelectedSlot] = useState(shop?.slots?.[0] || '7 - 9 AM');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cartItems = getCartItems();
  const subtotal = getCartSubtotal();
  const deliveryFee = shop?.deliveryFee || 0;
  const minOrder = shop?.minOrder || 150;

  const handlePlaceOrder = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanName || !/^\d{10}$/.test(cleanPhone) || !cleanAddress) {
      setErrorMsg('Please enter your name, a 10-digit mobile number, and delivery address.');
      return;
    }

    if (subtotal < minOrder) {
      setErrorMsg(`Minimum order amount is Rs. ${minOrder}. Please add more items.`);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const orderPayload = {
        customer: {
          name: cleanName,
          phone: cleanPhone,
          address: cleanAddress
        },
        items: cartItems.map(item => ({
          id: item.product.id,
          qty: item.qty
        })),
        slot: selectedSlot,
        payment: paymentMethod
      };

      const newOrder = await createOrder(orderPayload);

      // Persist profile and reset cart
      await saveUserProfile({ name: cleanName, phone: cleanPhone, address: cleanAddress });
      clearCart();
      setActiveOrder(newOrder);

      // Navigate to tracking
      onNavigate('track', { orderId: newOrder.id, order: newOrder });
    } catch (err) {
      setErrorMsg(err.message || 'Cannot place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout" onBack={() => onNavigate('cart')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>1. Delivery Details</Text>

          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Anand Kumar"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Mobile Number (10 digits)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 9876543210"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Door no, street, area, landmark, Madurai"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Step 2: Time Slot */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>2. Choose Delivery Slot</Text>
          <View style={styles.pillsRow}>
            {(shop?.slots || ['7 - 9 AM', '9 - 11 AM', '4 - 6 PM', '6 - 8 PM']).map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.pill, slot === selectedSlot && styles.pillActive]}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, slot === selectedSlot && styles.pillTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 3: Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>3. Payment Mode</Text>
          <View style={styles.pillsRow}>
            {['Cash', 'UPI', 'Card'].map(method => (
              <TouchableOpacity
                key={method}
                style={[styles.pill, method === paymentMethod && styles.pillActive]}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, method === paymentMethod && styles.pillTextActive]}>
                  {method === 'Cash' ? 'Cash on Delivery' : method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.paymentNote}>
            Pay easily at your doorstep via cash or scan UPI directly with the delivery partner.
          </Text>
        </View>

        {/* Error Notice */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Bill Breakdown */}
        <BillSummary subtotal={subtotal} deliveryFee={deliveryFee} />

        {/* Place Order CTA */}
        <TouchableOpacity
          style={[styles.placeBtn, submitting && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.primaryDark} />
          ) : (
            <Text style={styles.placeBtnText}>Place Order Now</Text>
          )}
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
    paddingBottom: 100
  },
  card: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMain,
    marginTop: 8,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textMain,
    backgroundColor: COLORS.surfaceWhite
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: 'top'
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgApp,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle
  },
  pillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted
  },
  pillTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  paymentNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 10,
    lineHeight: 16
  },
  errorBanner: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.danger
  },
  placeBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
    ...SHADOWS.floating
  },
  placeBtnDisabled: {
    opacity: 0.6
  },
  placeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark
  }
});

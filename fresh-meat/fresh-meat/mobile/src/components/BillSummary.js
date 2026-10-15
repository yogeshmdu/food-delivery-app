// Order Bill Summary Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function BillSummary({ subtotal, deliveryFee }) {
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Bill Details</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Item total</Text>
        <Text style={styles.value}>Rs. {subtotal}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery fee</Text>
        <Text style={styles.value}>Rs. {deliveryFee}</Text>
      </View>

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>To pay</Text>
        <Text style={styles.totalValue}>Rs. {total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginVertical: 12,
    ...SHADOWS.card
  },
  header: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  label: {
    fontSize: 14,
    color: COLORS.textMuted
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    marginTop: 8,
    paddingTop: 10
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary
  }
});

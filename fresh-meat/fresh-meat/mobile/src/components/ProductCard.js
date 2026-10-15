// Product card component with native image rendering
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getApiBaseUrl } from '../api/client';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function ProductCard({ product, quantity = 0, onAdd, onDecrement }) {
  const isAvailable = product.inStock;
  const baseUrl = getApiBaseUrl();
  const imageUri = product.image ? `${baseUrl}${product.image}` : null;

  return (
    <View style={styles.card}>
      {imageUri ? (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadgeFloat}>
            <Text style={styles.categoryBadgeText}>{product.cat}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.categoryBadge}>{product.cat}</Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.unit}>{product.unit}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>Rs. {product.price}</Text>

        {!isAvailable ? (
          <Text style={styles.soldOut}>Sold out</Text>
        ) : quantity > 0 ? (
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepBtn} onPress={onDecrement} activeOpacity={0.7}>
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepQty}>{quantity}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={onAdd} activeOpacity={0.7}>
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.7}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 10,
    margin: 6,
    ...SHADOWS.card
  },
  imageWrapper: {
    height: 110,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative'
  },
  productImage: {
    width: '100%',
    height: '100%'
  },
  categoryBadgeFloat: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 27, 92, 0.75)',
    borderRadius: RADIUS.pill,
    paddingVertical: 2,
    paddingHorizontal: 8
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textInverse
  },
  imagePlaceholder: {
    height: 110,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginTop: 8,
    minHeight: 36
  },
  unit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary
  },
  soldOut: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic'
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: -2
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 4
  },
  stepBtn: {
    width: 30,
    height: 34,
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
  }
});

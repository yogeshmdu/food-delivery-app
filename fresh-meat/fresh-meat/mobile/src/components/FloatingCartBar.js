// Floating Cart Banner for bottom of screen
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function FloatingCartBar({ count, subtotal, onPress }) {
  if (!count || count <= 0) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.85}>
        <View>
          <Text style={styles.infoText}>
            {count} {count === 1 ? 'item' : 'items'} • Rs. {subtotal}
          </Text>
          <Text style={styles.subText}>Extra charges may apply</Text>
        </View>
        <Text style={styles.viewCart}>View Cart →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 84,
    zIndex: 99
  },
  bar: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.xl,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.floating
  },
  infoText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  subText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    opacity: 0.8
  },
  viewCart: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark
  }
});

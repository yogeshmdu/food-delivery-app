// Visual 5-stage order progress stepper
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const ORDER_STAGES = [
  { key: 'placed', label: 'Placed' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'packing', label: 'Packing' },
  { key: 'out_for_delivery', label: 'On way' },
  { key: 'delivered', label: 'Delivered' }
];

export default function Stepper({ currentStatus }) {
  const currentIndex = ORDER_STAGES.findIndex(s => s.key === currentStatus);

  return (
    <View style={styles.container}>
      {ORDER_STAGES.map((stage, index) => {
        const isReached = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={stage.key} style={styles.step}>
            <View style={styles.lineContainer}>
              {index > 0 && (
                <View style={[styles.line, index <= currentIndex && styles.lineActive]} />
              )}
            </View>

            <View style={[styles.circle, isReached && styles.circleActive, isCurrent && styles.circleCurrent]}>
              {isReached && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <Text style={[styles.label, isReached && styles.labelActive]}>
              {stage.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16
  },
  step: {
    flex: 1,
    alignItems: 'center',
    position: 'relative'
  },
  lineContainer: {
    position: 'absolute',
    top: 10,
    left: '-50%',
    right: '50%',
    height: 3,
    zIndex: 1
  },
  line: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.borderInput
  },
  lineActive: {
    backgroundColor: COLORS.primary
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginBottom: 6
  },
  circleActive: {
    backgroundColor: COLORS.primary
  },
  circleCurrent: {
    borderWidth: 2,
    borderColor: COLORS.accent
  },
  checkmark: {
    color: COLORS.surfaceWhite,
    fontSize: 12,
    fontWeight: '700'
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center'
  },
  labelActive: {
    color: COLORS.textMain,
    fontWeight: '700'
  }
});

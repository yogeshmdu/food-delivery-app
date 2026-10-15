// Bottom Tab Navigation Bar
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function BottomNav({ activeTab, onSelectTab, cartCount = 0 }) {
  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'orders', label: 'Orders' },
    { key: 'cart', label: 'Cart', badge: cartCount },
    { key: 'profile', label: 'Profile' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {tab.badge > 0 && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 90
  },
  navBar: {
    height: 60,
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    ...SHADOWS.floating
  },
  tabButton: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  tabButtonActive: {
    backgroundColor: COLORS.accent
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textInverse
  },
  tabLabelActive: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeActive: {
    backgroundColor: COLORS.primaryDark
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  badgeTextActive: {
    color: COLORS.accent
  }
});

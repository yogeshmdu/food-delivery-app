// Past Orders History Screen Component
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const STATUS_LABELS = {
  placed: 'Placed',
  accepted: 'Accepted',
  packing: 'Packing',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  rejected: 'Rejected'
};

export default function OrdersScreen({ onNavigate }) {
  const { user, orders, refreshUserOrders } = useApp();

  useEffect(() => {
    refreshUserOrders();
  }, [user.phone]);

  if (!user.phone) {
    return (
      <View style={styles.container}>
        <Header title="My Orders" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>
            Please place an order or enter your mobile number in Profile to see past orders.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onNavigate('home')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="My Orders"
        subtitle={`Orders for +91 ${user.phone}`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No past orders found</Text>
            <Text style={styles.emptySubtitle}>
              Orders placed with phone {user.phone} will appear here.
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const statusLabel = STATUS_LABELS[order.status] || order.status;
            const itemsSummary = order.items.map(i => `${i.name} x${i.qty}`).join(', ');

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => onNavigate('track', { orderId: order.id, order })}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <View style={[styles.statusBadge, order.status === 'delivered' && styles.deliveredBadge]}>
                    <Text style={styles.statusText}>{statusLabel}</Text>
                  </View>
                </View>

                <Text style={styles.dateText}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>

                <Text style={styles.itemsText} numberOfLines={2}>{itemsSummary}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.totalPrice}>Rs. {order.total}</Text>
                  <Text style={styles.trackLink}>Track Order →</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
  orderCard: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain
  },
  statusBadge: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  deliveredBadge: {
    backgroundColor: COLORS.successBg
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4
  },
  itemsText: {
    fontSize: 13,
    color: COLORS.textMain,
    marginTop: 8,
    lineHeight: 18
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary
  },
  trackLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textInverse
  }
});

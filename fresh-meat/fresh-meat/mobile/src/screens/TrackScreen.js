// Order Tracking Screen Component with Live Polling
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet
} from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Stepper from '../components/Stepper';
import { getOrderById } from '../api/client';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const STATUS_TITLES = {
  placed: 'Order Placed',
  accepted: 'Accepted by Shop',
  packing: 'Cutting & Packing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  rejected: 'Order Rejected'
};

export default function TrackScreen({ routeParams, onNavigate }) {
  const { shop, user, activeOrder, setActiveOrder } = useApp();
  const [currentOrder, setCurrentOrder] = useState(routeParams?.order || activeOrder);
  const orderId = routeParams?.orderId || currentOrder?.id;

  // Poll for live status updates every 4 seconds
  useEffect(() => {
    let timer;

    async function pollStatus() {
      if (!orderId) return;
      try {
        const updated = await getOrderById(orderId, user.phone || currentOrder?.customer?.phone);
        if (updated) {
          setCurrentOrder(updated);
          setActiveOrder(updated);
        }
      } catch (err) {
        // Silent poll error
      }
    }

    pollStatus();
    timer = setInterval(pollStatus, 4000);

    return () => clearInterval(timer);
  }, [orderId, user.phone]);

  const handleCallShop = () => {
    const phoneNumber = shop?.phone || currentOrder?.customer?.phone;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  if (!currentOrder) {
    return (
      <View style={styles.container}>
        <Header title="Track Order" onBack={() => onNavigate('orders')} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Fetching order details...</Text>
        </View>
      </View>
    );
  }

  const isRejected = currentOrder.status === 'rejected';
  const statusTitle = STATUS_TITLES[currentOrder.status] || currentOrder.status;

  return (
    <View style={styles.container}>
      <Header
        title={`Order #${currentOrder.id}`}
        subtitle={currentOrder.slot}
        onBack={() => onNavigate('orders')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Header Card */}
        <View style={styles.statusCard}>
          <Text style={styles.orderNumber}>Order ID: #{currentOrder.id}</Text>
          <Text style={[styles.statusTitle, isRejected && styles.rejectedTitle]}>
            {statusTitle}
          </Text>

          {isRejected ? (
            <View style={styles.rejectedBanner}>
              <Text style={styles.rejectedBannerText}>
                The shop was unable to accept this order. Please call the shop directly.
              </Text>
            </View>
          ) : (
            <Stepper currentStatus={currentOrder.status} />
          )}
        </View>

        {/* Shop Contact Card */}
        <View style={styles.shopCard}>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{shop?.name || 'Madurai Mertal Meats'}</Text>
            <Text style={styles.shopAddress}>{shop?.address || '120/2 Mattuthavani, Madurai'}</Text>
            <Text style={styles.shopPhone}>{shop?.phone || '8098621639'}</Text>
          </View>
          <TouchableOpacity style={styles.callShopBtn} onPress={handleCallShop} activeOpacity={0.8}>
            <Text style={styles.callShopText}>📞 Call Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Order Items Breakdown */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsHeader}>Order Summary</Text>
          {currentOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemTitle}>
                {item.name} <Text style={styles.itemUnit}>({item.unit})</Text> x {item.qty}
              </Text>
              <Text style={styles.itemPrice}>Rs. {item.price * item.qty}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs. {currentOrder.total}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.paymentModeLabel}>Payment Method</Text>
            <Text style={styles.paymentModeValue}>{currentOrder.payment}</Text>
          </View>
        </View>

        {/* Customer Address Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsHeader}>Delivery Address</Text>
          <Text style={styles.customerName}>{currentOrder.customer.name}</Text>
          <Text style={styles.customerPhone}>+91 {currentOrder.customer.phone}</Text>
          <Text style={styles.customerAddress}>{currentOrder.customer.address}</Text>
        </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted
  },
  statusCard: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
    marginBottom: 8
  },
  rejectedTitle: {
    color: COLORS.danger
  },
  rejectedBanner: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.md,
    padding: 12,
    marginTop: 10
  },
  rejectedBannerText: {
    fontSize: 13,
    color: COLORS.danger,
    lineHeight: 18
  },
  shopCard: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...SHADOWS.card
  },
  shopInfo: {
    flex: 1,
    marginRight: 10
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  shopAddress: {
    fontSize: 12,
    color: COLORS.primaryDark,
    opacity: 0.8,
    marginTop: 2
  },
  shopPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginTop: 2
  },
  callShopBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  callShopText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  detailsCard: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card
  },
  detailsHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 12
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  itemTitle: {
    fontSize: 14,
    color: COLORS.textMain,
    flex: 1
  },
  itemUnit: {
    color: COLORS.textMuted
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginVertical: 8
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary
  },
  paymentModeLabel: {
    fontSize: 13,
    color: COLORS.textMuted
  },
  paymentModeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMain
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain
  },
  customerPhone: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2
  },
  customerAddress: {
    fontSize: 13,
    color: COLORS.textMain,
    marginTop: 4,
    lineHeight: 18
  }
});

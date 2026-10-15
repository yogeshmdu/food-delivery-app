// Root Application Component for React Native (iOS & Android)
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import BottomNav from './src/components/BottomNav';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import TrackScreen from './src/screens/TrackScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { COLORS } from './src/constants/theme';

function MainNavigator() {
  const { loading, error, getCartCount, reloadMenu } = useApp();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screenName);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Madurai Mertal Meats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Cannot Connect to Server</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.retryButton} onPress={reloadMenu}>
          Tap to Retry
        </Text>
      </View>
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigate} />;
      case 'category':
        return <CategoryScreen routeParams={screenParams} onNavigate={navigate} />;
      case 'cart':
        return <CartScreen onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutScreen onNavigate={navigate} />;
      case 'track':
        return <TrackScreen routeParams={screenParams} onNavigate={navigate} />;
      case 'orders':
        return <OrdersScreen onNavigate={navigate} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  const isMainTab = ['home', 'orders', 'cart', 'profile'].includes(currentScreen);

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.screenWrapper}>
        {renderActiveScreen()}
      </View>

      {/* Persistent Bottom Tab Bar on Primary Views */}
      {isMainTab && (
        <BottomNav
          activeTab={currentScreen}
          onSelectTab={(tab) => navigate(tab)}
          cartCount={getCartCount()}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.bgApp
  },
  screenWrapper: {
    flex: 1
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 6
  },
  errorMessage: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8
  }
});

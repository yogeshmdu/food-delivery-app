// Category Screen Component
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import { COLORS } from '../constants/theme';

export default function CategoryScreen({ routeParams, onNavigate }) {
  const { categories, products, cart, addToCart, decrementCart, getCartCount, getCartSubtotal } = useApp();
  const [selectedCat, setSelectedCat] = useState(routeParams?.category || categories[0] || 'Chicken');

  const filteredProducts = products.filter(p => p.cat === selectedCat);

  return (
    <View style={styles.container}>
      <Header
        title={selectedCat}
        subtitle={`${filteredProducts.length} items available`}
        onBack={() => onNavigate('home')}
      />

      {/* Category Tabs Rail */}
      <View style={styles.tabsRail}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {categories.map((cat) => (
            <Text
              key={cat}
              style={[styles.tabItem, cat === selectedCat && styles.tabItemActive]}
              onPress={() => setSelectedCat(cat)}
            >
              {cat}
            </Text>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard
                product={product}
                quantity={cart[product.id] || 0}
                onAdd={() => addToCart(product.id)}
                onDecrement={() => decrementCart(product.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <FloatingCartBar
        count={getCartCount()}
        subtotal={getCartSubtotal()}
        onPress={() => onNavigate('cart')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp
  },
  tabsRail: {
    backgroundColor: COLORS.surfaceWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  tabItem: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.bgApp
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
    color: COLORS.textInverse,
    fontWeight: '700'
  },
  scrollList: {
    paddingVertical: 12,
    paddingBottom: 150
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10
  },
  gridItem: {
    width: '50%'
  }
});

// Home Screen Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  StyleSheet
} from 'react-native';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import CategoryPill from '../components/CategoryPill';
import FloatingCartBar from '../components/FloatingCartBar';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function HomeScreen({ onNavigate }) {
  const { shop, categories, categoryImages, products, cart, addToCart, decrementCart, getCartCount, getCartSubtotal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getCartCount();
  const cartSubtotal = getCartSubtotal();

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter(p => p.name.toLowerCase().includes(query))
    : products.slice(0, 8);

  const handleCallShop = () => {
    if (shop?.phone) {
      Linking.openURL(`tel:${shop.phone}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.shopRow}>
            <View style={styles.shopChip}>
              <Text style={styles.shopSub}>Delivering from</Text>
              <Text style={styles.shopName} numberOfLines={1}>{shop?.name || 'Fresh to Home'}</Text>
              <Text style={styles.shopAddr} numberOfLines={1}>{shop?.address || 'Mattuthavani, Madurai'}</Text>
            </View>

            <TouchableOpacity style={styles.callButton} onPress={handleCallShop} activeOpacity={0.8}>
              <Text style={styles.callIcon}>📞</Text>
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tagline}>
            Fresh meat,{'\n'}
            <Text style={styles.taglineHighlight}>cut to order</Text>
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chicken, mutton, fish, eggs"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearch}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              title={cat}
              image={categoryImages?.[cat] || `/assets/images/categories/${cat.toLowerCase()}.jpg`}
              onPress={() => onNavigate('category', { category: cat })}
            />
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredProducts.length})` : 'Fresh Today'}
          </Text>
        </View>

        <View style={styles.productGrid}>
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

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        count={cartCount}
        subtotal={cartSubtotal}
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
  scrollContent: {
    paddingBottom: 160
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  shopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shopChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12
  },
  shopSub: {
    fontSize: 11,
    color: COLORS.textSubtle
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textInverse,
    marginTop: 2
  },
  shopAddr: {
    fontSize: 11,
    color: COLORS.textSubtle,
    marginTop: 2
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card
  },
  callIcon: {
    fontSize: 14
  },
  callText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  tagline: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    color: COLORS.textInverse,
    marginTop: 20
  },
  taglineHighlight: {
    color: COLORS.accent
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    marginTop: 18,
    height: 48,
    ...SHADOWS.card
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMain,
    height: '100%'
  },
  clearSearch: {
    fontSize: 16,
    color: COLORS.textMuted,
    paddingHorizontal: 6
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain
  },
  categoryList: {
    paddingHorizontal: 20
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14
  },
  gridItem: {
    width: '50%'
  }
});

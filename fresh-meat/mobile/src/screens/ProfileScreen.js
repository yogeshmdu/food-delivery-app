// Profile & Settings Screen Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  StyleSheet
} from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { getApiBaseUrl, setApiBaseUrl } from '../api/client';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function ProfileScreen({ onNavigate }) {
  const { user, shop, saveUserProfile, reloadMenu } = useApp();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [serverUrl, setServerUrl] = useState(getApiBaseUrl());
  const [showServerConfig, setShowServerConfig] = useState(false);

  const handleSaveProfile = async () => {
    if (phone && !/^\d{10}$/.test(phone.trim())) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    await saveUserProfile({ name, phone, address });
    Alert.alert('Profile Saved', 'Your contact details have been updated successfully.');
  };

  const handleUpdateServerUrl = () => {
    setApiBaseUrl(serverUrl);
    reloadMenu();
    Alert.alert('Server Updated', `Connecting to: ${serverUrl}`);
  };

  const handleCallShop = () => {
    if (shop?.phone) {
      Linking.openURL(`tel:${shop.phone}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="My Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Details</Text>

          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit phone number"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Default Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Door no, street, area, landmark, Madurai"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Details</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shop Information</Text>
          <Text style={styles.shopName}>{shop?.name || 'Madurai Mertal Meats'}</Text>
          <Text style={styles.shopAddress}>{shop?.address || '120/2 Mattuthavani, Madurai'}</Text>
          <Text style={styles.shopTiming}>⏰ Operating Hours: 7:00 AM - 9:00 PM</Text>

          <TouchableOpacity
            style={styles.callShopButton}
            onPress={handleCallShop}
            activeOpacity={0.8}
          >
            <Text style={styles.callShopText}>📞 Call {shop?.phone || '8098621639'}</Text>
          </TouchableOpacity>
        </View>

        {/* Server Endpoint Settings (For Testing On Real Device) */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setShowServerConfig(!showServerConfig)}
            style={styles.toggleRow}
          >
            <Text style={styles.configToggleTitle}>⚙️ Backend Server URL</Text>
            <Text style={styles.toggleArrow}>{showServerConfig ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showServerConfig && (
            <View style={styles.configContainer}>
              <Text style={styles.configHelp}>
                Enter your computer's local IP (e.g. http://192.168.1.5:3000) or deployed cloud URL:
              </Text>
              <TextInput
                style={styles.input}
                value={serverUrl}
                onChangeText={setServerUrl}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.configButton}
                onPress={handleUpdateServerUrl}
                activeOpacity={0.8}
              >
                <Text style={styles.configButtonText}>Connect to Server</Text>
              </TouchableOpacity>
            </View>
          )}
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
  card: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMain,
    marginTop: 8,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textMain,
    backgroundColor: COLORS.surfaceWhite
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: 'top'
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textInverse
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary
  },
  shopAddress: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 18
  },
  shopTiming: {
    fontSize: 13,
    color: COLORS.textMain,
    marginTop: 8,
    fontWeight: '500'
  },
  callShopButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14
  },
  callShopText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  configToggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain
  },
  toggleArrow: {
    fontSize: 12,
    color: COLORS.textMuted
  },
  configContainer: {
    marginTop: 12
  },
  configHelp: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
    lineHeight: 16
  },
  configButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8
  },
  configButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textInverse
  }
});

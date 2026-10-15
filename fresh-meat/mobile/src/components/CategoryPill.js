// Category button chip with image support
import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { getApiBaseUrl } from '../api/client';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export default function CategoryPill({ title, image, selected, onPress }) {
  const baseUrl = getApiBaseUrl();
  const imageUri = image ? `${baseUrl}${image}` : null;

  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.pillSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, selected && styles.avatarSelected]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <Text style={[styles.avatarText, selected && styles.avatarTextSelected]}>
            {title.slice(0, 2).toUpperCase()}
          </Text>
        )}
      </View>
      <Text style={[styles.text, selected && styles.textSelected]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    marginRight: 14,
    width: 76
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    ...SHADOWS.card
  },
  avatarSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary
  },
  avatarTextSelected: {
    color: COLORS.primary
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center'
  },
  textSelected: {
    color: COLORS.primary,
    fontWeight: '700'
  }
});

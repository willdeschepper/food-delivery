import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MenuItem } from '@/src/domain/models';
import { colors } from '@/src/theme/colors';
import { formatCurrency } from '@/src/utils/format';

type ProductCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export function ProductCard({ item, onAdd }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.art, { backgroundColor: item.accent }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        {item.popular ? <Text style={styles.badge}>POPULAR</Text> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          <Pressable
            accessibilityLabel={`Adicionar ${item.name}`}
            accessibilityRole="button"
            onPress={() => onAdd(item)}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Text style={styles.plus}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 238,
    borderRadius: 24,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  art: { height: 132, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 66 },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 9,
    backgroundColor: colors.text,
    color: colors.white,
    fontWeight: '600',
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    letterSpacing: 0.6,
  },
  body: { padding: 16 },
  name: { fontWeight: '600', fontSize: 17, color: colors.text },
  description: {
    minHeight: 40,
    marginTop: 5,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: { fontWeight: '600', fontSize: 16, color: colors.text },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { color: colors.white, fontSize: 25, fontWeight: '500', lineHeight: 28 },
  pressed: { transform: [{ scale: 0.94 }] },
});

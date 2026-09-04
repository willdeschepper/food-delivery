import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CartSummary } from '@/components/cart-summary';
import { OfflineBanner } from '@/components/offline-banner';
import { PrimaryButton } from '@/components/primary-button';
import { Screen } from '@/components/screen';
import { calculateCartTotals } from '@/src/domain/cart';
import { useDeliveryStore } from '@/src/state/delivery-store';
import { colors } from '@/src/theme/colors';
import { formatCurrency } from '@/src/utils/format';

export default function CartScreen() {
  const cart = useDeliveryStore(state => state.cart);
  const changeQuantity = useDeliveryStore(state => state.changeQuantity);
  const totals = calculateCartTotals(cart);

  if (cart.length === 0) {
    return (
      <Screen edges="header">
        <OfflineBanner />
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>🛍</Text>
          </View>
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptyText}>Escolha algo gostoso no cardápio para começar.</Text>
          <PrimaryButton label="Ver cardápio" onPress={() => router.replace('/')} style={styles.emptyButton} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges="header">
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>ITENS DO PEDIDO</Text>
        <View style={styles.card}>
          {cart.map((line, index) => (
            <View key={line.item.id}>
              <View style={styles.line}>
                <View style={[styles.art, { backgroundColor: line.item.accent }]}>
                  <Text style={styles.emoji}>{line.item.emoji}</Text>
                </View>
                <View style={styles.lineInfo}>
                  <Text style={styles.lineName}>{line.item.name}</Text>
                  <Text style={styles.linePrice}>{formatCurrency(line.item.price)}</Text>
                  <View style={styles.quantity}>
                    <Pressable
                      accessibilityLabel={`Diminuir ${line.item.name}`}
                      onPress={() => changeQuantity(line.item.id, line.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      {line.quantity === 1 ? (
                        <Text style={styles.removeText}>×</Text>
                      ) : (
                        <Text style={styles.quantitySymbol}>−</Text>
                      )}
                    </Pressable>
                    <Text style={styles.quantityText}>{line.quantity}</Text>
                    <Pressable
                      accessibilityLabel={`Aumentar ${line.item.name}`}
                      onPress={() => changeQuantity(line.item.id, line.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantitySymbol}>+</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.lineTotal}>
                  {formatCurrency(line.item.price * line.quantity)}
                </Text>
              </View>
              {index < cart.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>

        {totals.deliveryFee > 0 ? (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              Faltam {formatCurrency(50 - totals.subtotal)} para entrega grátis
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressValue, { width: `${Math.min(100, (totals.subtotal / 50) * 100)}%` }]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.freeDelivery}>
            <Text style={styles.freeDeliveryText}>✓ Você ganhou entrega grátis</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>RESUMO</Text>
        <View style={styles.card}>
          <CartSummary totals={totals} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={`Continuar · ${formatCurrency(totals.total)}`} onPress={() => router.push('/checkout')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 120 },
  sectionLabel: { marginTop: 4, marginBottom: 9, color: colors.textMuted, fontWeight: '600', fontSize: 10, letterSpacing: 1.1 },
  card: { borderRadius: 24, padding: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  line: { minHeight: 98, flexDirection: 'row', alignItems: 'center' },
  art: { width: 72, height: 72, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 36 },
  lineInfo: { flex: 1, marginLeft: 13 },
  lineName: { color: colors.text, fontWeight: '600', fontSize: 14 },
  linePrice: { marginTop: 2, color: colors.textMuted, fontWeight: '400', fontSize: 11 },
  lineTotal: { alignSelf: 'flex-start', marginTop: 9, color: colors.text, fontWeight: '600', fontSize: 13 },
  quantity: { marginTop: 9, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 12, backgroundColor: colors.surfaceMuted },
  quantityButton: { width: 34, height: 32, alignItems: 'center', justifyContent: 'center' },
  quantitySymbol: { color: colors.text, fontSize: 18, fontWeight: '600', lineHeight: 21 },
  removeText: { color: colors.danger, fontSize: 22, fontWeight: '500', lineHeight: 24 },
  quantityText: { minWidth: 24, color: colors.text, textAlign: 'center', fontWeight: '600', fontSize: 12 },
  divider: { height: 1, marginVertical: 9, backgroundColor: colors.border },
  progressCard: { marginVertical: 18, borderRadius: 18, padding: 15, backgroundColor: colors.warningSoft },
  progressTitle: { color: colors.warning, fontWeight: '500', fontSize: 12 },
  progressTrack: { height: 6, marginTop: 10, borderRadius: 4, overflow: 'hidden', backgroundColor: '#EBCF91' },
  progressValue: { height: '100%', borderRadius: 4, backgroundColor: colors.warning },
  freeDelivery: { marginVertical: 18, borderRadius: 18, padding: 15, backgroundColor: colors.successSoft },
  freeDeliveryText: { color: colors.success, fontWeight: '600', fontSize: 12 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, backgroundColor: colors.background },
  empty: { flex: 1, paddingHorizontal: 40, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { width: 84, height: 84, borderRadius: 28, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyIconText: { fontSize: 36 },
  emptyTitle: { marginTop: 22, color: colors.text, fontWeight: '700', fontSize: 21 },
  emptyText: { marginTop: 7, color: colors.textMuted, textAlign: 'center', fontWeight: '400', fontSize: 13, lineHeight: 20 },
  emptyButton: { width: '100%', marginTop: 24 },
});

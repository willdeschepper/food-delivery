import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OfflineBanner } from '@/components/offline-banner';
import { OrderTimeline } from '@/components/order-timeline';
import { PrimaryButton } from '@/components/primary-button';
import { Screen } from '@/components/screen';
import { orderSteps, orderStatusLabel } from '@/src/domain/order';
import { useDeliveryStore } from '@/src/state/delivery-store';
import { colors } from '@/src/theme/colors';
import { formatCurrency, formatOrderTime } from '@/src/utils/format';

export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const order = useDeliveryStore(state => state.orders.find(item => item.id === orderId));
  const online = useDeliveryStore(state => state.online);
  const advanceOrder = useDeliveryStore(state => state.advanceOrder);

  if (!order) {
    return (
      <Screen edges="header">
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>▤</Text>
          <Text style={styles.notFoundTitle}>Pedido não encontrado</Text>
          <PrimaryButton label="Voltar ao cardápio" onPress={() => router.replace('/')} style={styles.notFoundButton} />
        </View>
      </Screen>
    );
  }

  const currentStep = orderSteps.findIndex(step => step === order.status);
  const nextStatus = currentStep >= 0 ? orderSteps[currentStep + 1] : undefined;

  return (
    <Screen edges="header">
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, order.status === 'queued' && styles.heroQueued]}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>{order.status === 'delivered' ? '✓' : '➜'}</Text>
          </View>
          <Text style={styles.heroEyebrow}>PEDIDO {order.id}</Text>
          <Text style={styles.heroTitle}>{orderStatusLabel(order.status)}</Text>
          <Text style={styles.heroText}>
            {order.status === 'queued'
              ? 'Será enviado automaticamente quando houver conexão.'
              : order.status === 'delivered'
                ? 'Entregue no endereço selecionado.'
                : 'Previsão de chegada entre 25 e 35 minutos.'}
          </Text>
        </View>

        <View style={styles.card}>
          <OrderTimeline status={order.status} />
        </View>

        <View style={styles.card}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoIcon}>⌖</Text>
            <Text style={styles.cardTitle}>Endereço de entrega</Text>
          </View>
          <Text style={styles.infoStrong}>{order.address.street}</Text>
          <Text style={styles.infoText}>{order.address.complement}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoIcon}>▤</Text>
            <Text style={styles.cardTitle}>Resumo do pedido</Text>
          </View>
          {order.lines.map(line => (
            <View key={line.item.id} style={styles.orderLine}>
              <Text style={styles.infoText}>{line.quantity}× {line.item.name}</Text>
              <Text style={styles.infoStrong}>{formatCurrency(line.item.price * line.quantity)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.orderLine}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totals.total)}</Text>
          </View>
          <Text style={styles.orderTime}>Realizado às {formatOrderTime(order.createdAt)}</Text>
        </View>

        {online && nextStatus ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => advanceOrder(order.id, nextStatus)}
            style={styles.demoAction}
          >
            <Text style={styles.demoLabel}>DEMONSTRAÇÃO</Text>
            <Text style={styles.demoText}>Atualizar para “{orderStatusLabel(nextStatus)}”</Text>
          </Pressable>
        ) : null}

        <PrimaryButton label="Voltar ao cardápio" onPress={() => router.replace('/')} variant="secondary" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14, paddingBottom: 36 },
  hero: { minHeight: 205, borderRadius: 30, padding: 22, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  heroQueued: { backgroundColor: colors.warning },
  heroIcon: { width: 64, height: 64, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  heroIconText: { color: colors.white, fontSize: 34, fontWeight: '700' },
  heroEyebrow: { marginTop: 14, color: 'rgba(255,255,255,0.72)', fontWeight: '600', fontSize: 9, letterSpacing: 1 },
  heroTitle: { marginTop: 4, color: colors.white, fontWeight: '700', fontSize: 23 },
  heroText: { maxWidth: 280, marginTop: 5, color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontWeight: '400', fontSize: 11, lineHeight: 18 },
  card: { borderRadius: 24, padding: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  infoHeader: { marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoIcon: { color: colors.primary, fontSize: 20, fontWeight: '700' },
  cardTitle: { color: colors.text, fontWeight: '600', fontSize: 14 },
  infoStrong: { color: colors.text, fontWeight: '500', fontSize: 12 },
  infoText: { color: colors.textMuted, fontWeight: '400', fontSize: 11, lineHeight: 18 },
  orderLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8 },
  divider: { height: 1, marginVertical: 12, backgroundColor: colors.border },
  totalLabel: { color: colors.text, fontWeight: '600', fontSize: 15 },
  totalValue: { color: colors.text, fontWeight: '700', fontSize: 16 },
  orderTime: { marginTop: 10, color: colors.textMuted, fontWeight: '400', fontSize: 10 },
  demoAction: { borderRadius: 18, padding: 15, backgroundColor: colors.surfaceMuted, alignItems: 'center' },
  demoLabel: { color: colors.primary, fontWeight: '600', fontSize: 9, letterSpacing: 1 },
  demoText: { marginTop: 2, color: colors.text, fontWeight: '500', fontSize: 12 },
  notFound: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' },
  notFoundIcon: { color: colors.primary, fontSize: 44, fontWeight: '600' },
  notFoundTitle: { marginTop: 18, color: colors.text, fontWeight: '700', fontSize: 21 },
  notFoundButton: { width: '100%', marginTop: 22 },
});

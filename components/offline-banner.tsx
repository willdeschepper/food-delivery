import { StyleSheet, Text, View } from 'react-native';

import { useDeliveryStore } from '@/src/state/delivery-store';
import { colors } from '@/src/theme/colors';

export function OfflineBanner() {
  const online = useDeliveryStore(state => state.online);
  const queued = useDeliveryStore(
    state => state.orders.filter(order => order.status === 'queued').length,
  );

  if (online && queued === 0) return null;

  return (
    <View style={[styles.banner, online ? styles.syncing : styles.offline]}>
      <Text style={[styles.icon, online ? styles.syncingText : styles.offlineText]}>
        {online ? '↻' : '☁︎'}
      </Text>
      <Text style={[styles.text, online ? styles.syncingText : styles.offlineText]}>
        {online
          ? `Sincronizando ${queued} ${queued === 1 ? 'pedido' : 'pedidos'}`
          : 'Sem internet — seu carrinho e pedidos continuam salvos'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 40,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  offline: { backgroundColor: colors.warningSoft },
  syncing: { backgroundColor: colors.successSoft },
  text: { fontWeight: '500', fontSize: 12 },
  icon: { fontSize: 18, fontWeight: '700' },
  offlineText: { color: colors.warning },
  syncingText: { color: colors.success },
});

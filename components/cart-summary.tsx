import { StyleSheet, Text, View } from 'react-native';

import type { CartTotals } from '@/src/domain/models';
import { colors } from '@/src/theme/colors';
import { formatCurrency } from '@/src/utils/format';

export function CartSummary({ totals }: { totals: CartTotals }) {
  return (
    <View style={styles.container}>
      <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
      <Row
        label="Entrega"
        value={totals.deliveryFee === 0 ? 'Grátis' : formatCurrency(totals.deliveryFee)}
        success={totals.deliveryFee === 0}
      />
      <Row label="Taxa de serviço" value={formatCurrency(totals.serviceFee)} />
      <View style={styles.divider} />
      <Row label="Total" value={formatCurrency(totals.total)} strong />
    </View>
  );
}

function Row({
  label,
  value,
  strong = false,
  success = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  success?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.text, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.text, strong && styles.strong, success && styles.success]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  text: { fontWeight: '400', fontSize: 14, color: colors.textMuted },
  strong: { fontWeight: '600', fontSize: 18, color: colors.text },
  success: { fontWeight: '600', color: colors.success },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 3 },
});

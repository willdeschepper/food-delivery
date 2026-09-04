import { StyleSheet, Text, View } from 'react-native';

import { orderSteps, orderStatusLabel } from '@/src/domain/order';
import type { OrderStatus } from '@/src/domain/models';
import { colors } from '@/src/theme/colors';

const symbols = {
  confirmed: '✓',
  preparing: '♨',
  on_the_way: '⌖',
  delivered: '★',
} as const;

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'queued') {
    return (
      <View style={styles.queued}>
        <Text style={styles.queuedIcon}>◷</Text>
        <View style={styles.queuedCopy}>
          <Text style={styles.queuedTitle}>Pedido salvo no aparelho</Text>
          <Text style={styles.queuedText}>
            A mesma identificação será usada quando a conexão voltar, evitando criar outro pedido.
          </Text>
        </View>
      </View>
    );
  }

  const currentIndex = orderSteps.indexOf(status);

  return (
    <View>
      {orderSteps.map((step, index) => {
        const symbol = symbols[step];
        const complete = index < currentIndex;
        const active = index === currentIndex;

        return (
          <View key={step} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.dot, (complete || active) && styles.dotActive]}>
                <Text style={[styles.stepIcon, (complete || active) && styles.stepIconActive]}>
                  {complete ? '✓' : symbol}
                </Text>
              </View>
              {index < orderSteps.length - 1 ? (
                <View style={[styles.line, complete && styles.lineComplete]} />
              ) : null}
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, active && styles.titleActive]}>
                {orderStatusLabel(step)}
              </Text>
              <Text style={styles.description}>{descriptions[step]}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const descriptions: Record<(typeof orderSteps)[number], string> = {
  confirmed: 'Recebemos seu pedido e o restaurante foi avisado.',
  preparing: 'A cozinha está preparando tudo com cuidado.',
  on_the_way: 'O entregador está seguindo para o seu endereço.',
  delivered: 'Tudo certo. Bom apetite!',
};

const styles = StyleSheet.create({
  step: { minHeight: 82, flexDirection: 'row' },
  rail: { width: 42, alignItems: 'center' },
  dot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: colors.primary },
  stepIcon: { color: colors.textMuted, fontSize: 15, fontWeight: '700' },
  stepIconActive: { color: colors.white },
  line: { flex: 1, width: 2, backgroundColor: colors.border },
  lineComplete: { backgroundColor: colors.primary },
  copy: { flex: 1, paddingLeft: 10, paddingTop: 4 },
  title: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  titleActive: { color: colors.text },
  description: { maxWidth: 270, marginTop: 3, color: colors.textMuted, fontWeight: '400', fontSize: 11, lineHeight: 17 },
  queued: { borderRadius: 22, padding: 18, backgroundColor: colors.warningSoft, flexDirection: 'row', alignItems: 'flex-start' },
  queuedIcon: { color: colors.warning, fontSize: 25, fontWeight: '700' },
  queuedCopy: { flex: 1, marginLeft: 13 },
  queuedTitle: { color: colors.warning, fontWeight: '600', fontSize: 14 },
  queuedText: { marginTop: 4, color: colors.warning, fontWeight: '400', fontSize: 11, lineHeight: 18 },
});
